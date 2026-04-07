"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterSync = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a random 32-byte hex string to use as a session ID,
 * mimicking the browser's: Md5.md5(Math.random()) + Md5.md5(Math.random())
 */
function generateSessionId() {
    return crypto_1.default.randomBytes(16).toString('hex') + crypto_1.default.randomBytes(16).toString('hex');
}
function normalizeRouterPassword(input) {
    if (!input)
        return '';
    // Decode only valid %HH bytes so strings like "%m%22" become "%m\"".
    return input.replace(/%([0-9a-fA-F]{2})/g, (_match, hex) => String.fromCharCode(parseInt(hex, 16)));
}
const DEFAULT_ROUTER_URL = process.env.ROUTER_URL || 'http://192.168.1.1';
const DEFAULT_ROUTER_USER = process.env.ROUTER_USERNAME || 'admin';
const DEFAULT_ROUTER_PASS_RAW = process.env.ROUTER_PASSWORD || '';
function isValidMacAddress(mac) {
    const normalized = mac.replace(/[:\-\s]/g, '');
    return /^[0-9a-fA-F]{12}$/.test(normalized);
}
function routerPost(routerUrl_1, body_1) {
    return __awaiter(this, arguments, void 0, function* (routerUrl, body, sessionId = '') {
        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
        };
        if (sessionId) {
            headers['Cookie'] = `sessionID=${sessionId}`;
        }
        const timestamp = Date.now();
        const cgiUrl = `${routerUrl}/cgi-bin/http.cgi?_t=${timestamp}`;
        const finalBody = Object.assign(Object.assign({}, body), { method: body.method || 'GET', sessionId: body.sessionId || sessionId || '', language: body.language || 'EN' });
        const res = yield fetch(cgiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(finalBody),
        });
        const text = yield res.text();
        if (!res.ok) {
            console.error(`[RouterSync] HTTP ${res.status} from ${cgiUrl}. Body: ${text}`);
            throw new Error(`[RouterSync] HTTP error ${res.status} from router.`);
        }
        try {
            return JSON.parse(text);
        }
        catch (_a) {
            console.warn(`[RouterSync] Non-JSON response from ${cgiUrl}: ${text.substring(0, 500)}`);
            return { raw: text };
        }
    });
}
/**
 * Utility to synchronize user status with the Airtel 5G Router's MAC filtering rules.
 */
class RouterSync {
    static ensureLoggedIn(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = config.routerUrl;
            const session = this.sessions.get(key);
            if (session === null || session === void 0 ? void 0 : session.sessionId) {
                return session.sessionId;
            }
            const existingPromise = this.loginPromises.get(key);
            if (existingPromise) {
                return existingPromise;
            }
            const loginPromise = (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const now = Date.now();
                    const lastAttempt = this.lastLoginAttemptTimes.get(key) || 0;
                    if (now - lastAttempt < 5000) {
                        console.warn(`[RouterSync] Login for ${key} requested too soon. Waiting...`);
                        yield new Promise(r => setTimeout(r, 2000));
                    }
                    this.lastLoginAttemptTimes.set(key, Date.now());
                    const sid = yield this.login(config);
                    const currentSession = this.sessions.get(key) || { sessionId: '', variantIndex: null };
                    this.sessions.set(key, Object.assign(Object.assign({}, currentSession), { sessionId: sid }));
                    return sid;
                }
                finally {
                    this.loginPromises.delete(key);
                }
            }))();
            this.loginPromises.set(key, loginPromise);
            return loginPromise;
        });
    }
    static login(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawPass = config.routerPasswordRaw || DEFAULT_ROUTER_PASS_RAW;
            const user = config.routerUsername || DEFAULT_ROUTER_USER;
            const pass = normalizeRouterPassword(rawPass);
            console.log(`[RouterSync] Starting login discovery for ${config.routerUrl}...`);
            const bootstrapToken = yield this.getSessionToken(config.routerUrl);
            const variants = this.buildLoginVariants(bootstrapToken, user, pass, rawPass);
            const sessionInfo = this.sessions.get(config.routerUrl);
            const sortedIndices = Array.from(variants.keys());
            const prevIndex = sessionInfo === null || sessionInfo === void 0 ? void 0 : sessionInfo.variantIndex;
            if (typeof prevIndex === 'number' && prevIndex >= 0 && prevIndex < variants.length) {
                const pos = sortedIndices.indexOf(prevIndex);
                if (pos > -1) {
                    sortedIndices.splice(pos, 1);
                    sortedIndices.unshift(prevIndex);
                }
            }
            for (const idx of sortedIndices) {
                const variant = variants[idx];
                const sessionId = yield this.tryVariant(config.routerUrl, variant);
                if (sessionId) {
                    console.log(`[RouterSync] Successfully logged in to ${config.routerUrl} using "${variant.name}"`);
                    this.sessions.set(config.routerUrl, { sessionId, variantIndex: idx });
                    return sessionId;
                }
            }
            throw new Error(`Router login failed for ${config.routerUrl}. Check credentials.`);
        });
    }
    static buildLoginVariants(token, user, pass, rawPass) {
        const candidates = Array.from(new Set([pass, rawPass].filter(Boolean)));
        const variants = [];
        for (const candidate of candidates) {
            // SHA256 Variants
            const sha1 = crypto_1.default.createHash('sha256').update(token + candidate).digest('hex');
            variants.push({
                name: `sha256(token + pass)`,
                body: { cmd: 100, method: 'POST', username: user, passwd: sha1, isAutoUpgrade: '0', subcmd: 0 },
            });
            const shaPre = crypto_1.default.createHash('sha256').update(candidate).digest('hex');
            const sha4 = crypto_1.default.createHash('sha256').update(user + shaPre + token).digest('hex');
            variants.push({
                name: `sha256(user + sha256(pass) + token)`,
                body: { cmd: 100, method: 'POST', username: user, passwd: sha4, isAutoUpgrade: '0', subcmd: 0 },
            });
            // MD5 Variants
            const md5_3 = crypto_1.default.createHash('md5').update(user + candidate + token).digest('hex');
            variants.push({
                name: `md5(user + pass + token)`,
                body: { cmd: 100, method: 'POST', username: user, passwd: md5_3, isAutoUpgrade: '0', subcmd: 0 },
            });
            const md5_1 = crypto_1.default.createHash('md5').update(token + candidate).digest('hex');
            variants.push({
                name: `md5(token + pass)`,
                body: { cmd: 100, method: 'POST', username: user, passwd: md5_1, isAutoUpgrade: '0', subcmd: 0 },
            });
        }
        return variants;
    }
    static tryVariant(routerUrl, variant) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginSessionId = generateSessionId();
            const bodyWithSession = Object.assign(Object.assign({}, variant.body), { sessionId: loginSessionId });
            try {
                const data = yield routerPost(routerUrl, bodyWithSession, loginSessionId);
                if (data && (data.success === true || data.success === 'true')) {
                    if (data.login_fail === 'fail' || data.login_fail2 === 'fail') {
                        return null;
                    }
                    return data.sessionId || loginSessionId;
                }
            }
            catch (e) {
                console.error(`[RouterSync] Variant attempt error for ${routerUrl}:`, e);
            }
            return null;
        });
    }
    static getSessionToken(routerUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const cmd of [233, 232]) {
                try {
                    const data = yield routerPost(routerUrl, { cmd, method: 'GET' });
                    if (data && data.token)
                        return data.token;
                }
                catch (e) { }
            }
            throw new Error(`No session token from router at ${routerUrl}`);
        });
    }
    static getMacRules(routerUrl, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtersData = yield routerPost(routerUrl, { cmd: 23 }, sessionId);
            return (filtersData === null || filtersData === void 0 ? void 0 : filtersData.datas) || [];
        });
    }
    static saveMacRules(routerUrl, sessionId, rules) {
        return __awaiter(this, void 0, void 0, function* () {
            yield routerPost(routerUrl, { cmd: 23, method: 'POST', datas: rules }, sessionId);
            yield routerPost(routerUrl, { cmd: 20 }, sessionId);
        });
    }
    static toggleMacRule(config, macAddress, userName, enable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isValidMacAddress(macAddress)) {
                throw new Error(`Invalid MAC address: ${macAddress}`);
            }
            const sessionId = yield this.ensureLoggedIn(config);
            let rules = yield this.getMacRules(config.routerUrl, sessionId);
            const normalizedTarget = macAddress.replace(/[:\-\s]/g, '').toLowerCase();
            const ruleIndex = rules.findIndex(r => r.mac.replace(/[:\-\s]/g, '').toLowerCase() === normalizedTarget);
            if (ruleIndex === -1) {
                if (!enable)
                    return;
                rules.push({ remark: userName, mac: macAddress, enableRule: true, enableLink: true });
            }
            else {
                if (rules[ruleIndex].enableRule === enable)
                    return;
                rules[ruleIndex].enableRule = enable;
            }
            yield this.saveMacRules(config.routerUrl, sessionId, rules);
        });
    }
    static getRouterData(config, cmd, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sId = sessionId || (yield this.ensureLoggedIn(config));
            try {
                const data = yield routerPost(config.routerUrl, { cmd }, sId);
                // Comprehensive check for session expiration or unauthorized access
                const isExpired = data && (data.error_code === 104 ||
                    data.error === 104 ||
                    data.error === 101 ||
                    data.success === false);
                if (isExpired) {
                    console.warn(`[RouterSync] Session expired or invalid for ${config.routerUrl} (Cmd: ${cmd}). Re-authenticating...`);
                    this.sessions.delete(config.routerUrl);
                    // Only retry if we haven't already passed an explicit sessionId
                    if (!sessionId) {
                        const newSId = yield this.ensureLoggedIn(config);
                        return yield routerPost(config.routerUrl, { cmd }, newSId);
                    }
                }
                return data;
            }
            catch (e) {
                this.sessions.delete(config.routerUrl);
                throw e;
            }
        });
    }
    static getSignalStatus(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Command 1018 provides both signal and traffic info in an array called device_info
                const response = yield this.getRouterData(config, 1018);
                if (!response.success || !Array.isArray(response.device_info)) {
                    return {
                        rsrp: '0',
                        sinr: '0',
                        signalLevel: '0',
                        networkType: 'N/A',
                        enrch_rsrp: '0',
                        enrch_sinr: '0'
                    };
                }
                const latest = response.device_info[response.device_info.length - 1];
                const rsrp = latest.rsrp_4g || latest.rsrp || '0';
                const sinr = latest.sinr_4g || latest.sinr || '0';
                // Calculate signal level (0-4 or 0-5) based on RSRP
                let signalLevel = '0';
                const rsrpVal = parseInt(rsrp);
                if (rsrpVal > -80)
                    signalLevel = '5';
                else if (rsrpVal > -90)
                    signalLevel = '4';
                else if (rsrpVal > -100)
                    signalLevel = '3';
                else if (rsrpVal > -110)
                    signalLevel = '2';
                else if (rsrpVal > -120)
                    signalLevel = '1';
                return {
                    rsrp,
                    sinr,
                    signalLevel,
                    networkType: latest.network_type || 'N/A',
                    enrch_rsrp: latest.rsrp_5g || '0',
                    enrch_sinr: latest.sinr_5g || '0'
                };
            }
            catch (error) {
                console.error(`[RouterSync] Failed to get signal status for ${config.routerUrl}:`, error);
                throw error;
            }
        });
    }
    static getConnectedDevices(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.getRouterData(config, 223);
                const deviceList = response.dhcp_list_info || response.device_list || response.list || [];
                return deviceList.map((dev) => ({
                    id: dev.mac,
                    mac: dev.mac,
                    name: dev.host || dev.hostname || dev.name || 'Unknown Device',
                    ip: dev.ip,
                    isWhitelisted: false // Will be updated by the controller
                }));
            }
            catch (error) {
                console.error(`[RouterSync] Failed to get connected devices for ${config.routerUrl}:`, error);
                return [];
            }
        });
    }
    static getTrafficStats(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.getRouterData(config, 1018);
                if (!response.success || !Array.isArray(response.device_info) || response.device_info.length < 2) {
                    return { uploadSpeed: '0', downloadSpeed: '0' };
                }
                const info = response.device_info;
                const latest = info[info.length - 1];
                const previous = info[info.length - 2];
                // Assuming dl_flow and ul_flow are totals in MB
                // Speed = (CurrentTotal - PreviousTotal) / (CurrentTime - PreviousTime)
                const dl1 = parseFloat(latest.dl_flow);
                const dl2 = parseFloat(previous.dl_flow);
                const ul1 = parseFloat(latest.ul_flow);
                const ul2 = parseFloat(previous.ul_flow);
                const parseRouterTime = (timeStr) => {
                    // Format: "2026/04/06/12:18:33"
                    const parts = timeStr.split(/[\/:]/);
                    if (parts.length < 6)
                        return Date.now();
                    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5])).getTime();
                };
                const time1 = parseRouterTime(latest.time);
                const time2 = parseRouterTime(previous.time);
                const seconds = Math.max(1, (time1 - time2) / 1000);
                const dlDiff = dl1 - dl2;
                const ulDiff = ul1 - ul2;
                // Speed in Mbps (assuming dl_flow is in MB and seconds is time diff)
                // (MB * 8) / seconds = Mbps
                const dlMbps = dlDiff > 0 ? ((dlDiff * 8) / seconds).toFixed(2) : '0.00';
                const ulMbps = ulDiff > 0 ? ((ulDiff * 8) / seconds).toFixed(2) : '0.00';
                return {
                    uploadSpeed: ulMbps,
                    downloadSpeed: dlMbps,
                    unit: 'Mbps'
                };
            }
            catch (error) {
                console.error(`[RouterSync] Failed to get traffic stats for ${config.routerUrl}:`, error);
                return { uploadSpeed: '0', downloadSpeed: '0' };
            }
        });
    }
    static getSystemStatus(config) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const [res1018, res120] = yield Promise.all([
                    this.getRouterData(config, 1018),
                    this.getRouterData(config, 120).catch(() => ({}))
                ]);
                const latest = ((_a = res1018.device_info) === null || _a === void 0 ? void 0 : _a[res1018.device_info.length - 1]) || {};
                return {
                    cpu: latest.cpu_usage || latest.cpuusage || '0',
                    memory: latest.ram_usage || latest.ramusage || latest.mem_usage || latest.memusage || latest.memory_usage || '0',
                    uptime: latest.sys_uptime || latest.sys_runtime || res120.runtime || res120.uptime || '0',
                    wanIp: res120.wan_ip || res120.wanip || '---',
                    model: res120.model_name || res120.modelname || 'ZLT X17M',
                    firmware: res120.sw_version || res120.swversion || '---'
                };
            }
            catch (error) {
                console.error(`[RouterSync] Failed to get system status for ${config.routerUrl}:`, error);
                return { cpu: '0', memory: '0', uptime: '0', wanIp: '---' };
            }
        });
    }
    static syncUser(config, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.macAddress)
                return;
            yield this.toggleMacRule(config, user.macAddress, user.name, user.status === 'active');
        });
    }
}
exports.RouterSync = RouterSync;
RouterSync.sessions = new Map();
RouterSync.loginPromises = new Map();
RouterSync.lastLoginAttemptTimes = new Map();
