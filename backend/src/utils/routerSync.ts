import crypto from 'crypto';
import { IWifiUser } from '../models/WifiUser';

/**
 * Generates a random 32-byte hex string to use as a session ID,
 * mimicking the browser's: Md5.md5(Math.random()) + Md5.md5(Math.random())
 */
function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex') + crypto.randomBytes(16).toString('hex');
}

export interface RouterConfig {
  routerUrl: string;
  routerUsername: string;
  routerPasswordRaw: string;
}

function normalizeRouterPassword(input: string): string {
  if (!input) return '';
  // Decode only valid %HH bytes so strings like "%m%22" become "%m\"".
  return input.replace(/%([0-9a-fA-F]{2})/g, (_match, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

const DEFAULT_ROUTER_URL = process.env.ROUTER_URL || 'http://192.168.1.1';
const DEFAULT_ROUTER_USER = process.env.ROUTER_USERNAME || 'admin';
const DEFAULT_ROUTER_PASS_RAW = process.env.ROUTER_PASSWORD || '';

interface MacRule {
  remark: string;
  mac: string;
  enableRule: number;
  enableLink: number;
  [key: string]: any;
}

function isValidMacAddress(mac: string): boolean {
  const normalized = mac.replace(/[:\-\s]/g, '');
  return /^[0-9a-fA-F]{12}$/.test(normalized);
}

/** Colon-separated uppercase MAC for router UI consistency and reliable matching. */
function formatMacForRouter(mac: string): string {
  const hex = mac.replace(/[:\-\s]/g, '').toLowerCase();
  if (!/^[0-9a-f]{12}$/.test(hex)) return mac.trim();
  return hex.match(/.{2}/g)!.map((b) => b.toUpperCase()).join(':');
}

function isRuleEnabled(rule: any): boolean {
  const v = rule?.enableRule;
  if (v === true || v === 1 || v === '1') return true;
  if (v === false || v === 0 || v === '0') return false;
  return Boolean(v);
}

async function routerPost(routerUrl: string, body: any, sessionId: string = ''): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json; charset=UTF-8',
    };

    if (sessionId) {
        headers['Cookie'] = `sessionID=${sessionId}`;
    }

    const timestamp = Date.now();
    const cgiUrl = `${routerUrl}/cgi-bin/http.cgi?_t=${timestamp}`;
    
    const finalBody = {
        ...body,
        method: body.method || 'GET',
        sessionId: sessionId || body.sessionId || '',
        token: body.token || '',
        language: body.language || 'EN'
    };

    const res = await fetch(cgiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(finalBody),
    });
    const text = await res.text();

    if (!res.ok) {
        console.error(`[RouterSync] HTTP ${res.status} from ${cgiUrl}. Body: ${text}`);
        throw new Error(`[RouterSync] HTTP error ${res.status} from router.`);
    }

    try {
        return JSON.parse(text);
    } catch {
        console.warn(`[RouterSync] Non-JSON response from ${cgiUrl}: ${text.substring(0, 500)}`);
        return { raw: text };
    }
}

/**
 * Utility to synchronize user status with the Airtel 5G Router's MAC filtering rules.
 */
export class RouterSync {
  private static sessions = new Map<string, { sessionId: string; token?: string; variantIndex: number | null; lastUsed: number }>();
  private static loginPromises = new Map<string, Promise<string>>();
  private static lastLoginAttemptTimes = new Map<string, number>();

  private static async ensureLoggedIn(config: RouterConfig): Promise<string> {
    const key = config.routerUrl;
    const session = this.sessions.get(key);
    if (session?.sessionId) {
      return session.sessionId;
    }

    const existingPromise = this.loginPromises.get(key);
    if (existingPromise) {
      return existingPromise;
    }

    const loginPromise = (async () => {
      try {
        const now = Date.now();
        const lastAttempt = this.lastLoginAttemptTimes.get(key) || 0;
        if (now - lastAttempt < 5000) {
          console.warn(`[RouterSync] Login for ${key} requested too soon. Waiting...`);
          await new Promise(r => setTimeout(r, 2000));
        }

        this.lastLoginAttemptTimes.set(key, Date.now());
        const sid = await this.login(config);
        // Token and sessionId are set inside login() now
        return sid;
      } finally {
        this.loginPromises.delete(key);
      }
    })();

    this.loginPromises.set(key, loginPromise);
    return loginPromise;
  }

  private static async login(config: RouterConfig): Promise<string> {
    const rawPass = config.routerPasswordRaw || DEFAULT_ROUTER_PASS_RAW;
    const user = config.routerUsername || DEFAULT_ROUTER_USER;
    const pass = normalizeRouterPassword(rawPass);

    console.log(`[RouterSync] Starting login discovery for ${config.routerUrl}...`);
    
    const bootstrapToken = await this.getSessionToken(config.routerUrl);
    const variants = this.buildLoginVariants(bootstrapToken, user, pass, rawPass);
    
    const sessionInfo = this.sessions.get(config.routerUrl);
    const sortedIndices = Array.from(variants.keys());
    const prevIndex = sessionInfo?.variantIndex;
    if (typeof prevIndex === 'number' && prevIndex >= 0 && prevIndex < variants.length) {
      const pos = sortedIndices.indexOf(prevIndex);
      if (pos > -1) {
        sortedIndices.splice(pos, 1);
        sortedIndices.unshift(prevIndex);
      }
    }

    for (const idx of sortedIndices) {
      const variant = variants[idx];
      const result = await this.tryVariant(config.routerUrl, variant);
      
      if (result) {
        console.log(`[RouterSync] Successfully logged in to ${config.routerUrl} using "${variant.name}"`);
        this.sessions.set(config.routerUrl, { 
          sessionId: result.sessionId, 
          token: result.token,
          variantIndex: idx,
          lastUsed: Date.now()
        });
        return result.sessionId;
      }
    }

    throw new Error(`Router login failed for ${config.routerUrl}. Check credentials.`);
  }

  private static buildLoginVariants(token: string, user: string, pass: string, rawPass: string) {
    const candidates = Array.from(new Set([pass, rawPass].filter(Boolean)));
    const variants: Array<{ name: string; body: any }> = [];

    for (const candidate of candidates) {
      // SHA256 Variants
      const sha1 = crypto.createHash('sha256').update(token + candidate).digest('hex');
      variants.push({
        name: `sha256(token + pass)`,
        body: { cmd: 100, method: 'POST', username: user, passwd: sha1, isAutoUpgrade: '0', subcmd: 0 },
      });

      const shaPre = crypto.createHash('sha256').update(candidate).digest('hex');
      const sha4 = crypto.createHash('sha256').update(user + shaPre + token).digest('hex');
      variants.push({
        name: `sha256(user + sha256(pass) + token)`,
        body: { cmd: 100, method: 'POST', username: user, passwd: sha4, isAutoUpgrade: '0', subcmd: 0 },
      });

      // MD5 Variants
      const md5_3 = crypto.createHash('md5').update(user + candidate + token).digest('hex');
      variants.push({
        name: `md5(user + pass + token)`,
        body: { cmd: 100, method: 'POST', username: user, passwd: md5_3, isAutoUpgrade: '0', subcmd: 0 },
      });
      
      const md5_1 = crypto.createHash('md5').update(token + candidate).digest('hex');
      variants.push({
        name: `md5(token + pass)`,
        body: { cmd: 100, method: 'POST', username: user, passwd: md5_1, isAutoUpgrade: '0', subcmd: 0 },
      });
    }
    return variants;
  }

  private static async tryVariant(routerUrl: string, variant: { name: string; body: any }): Promise<{ sessionId: string; token: string } | null> {
    const loginSessionId = generateSessionId();
    const bodyWithSession = { ...variant.body, sessionId: loginSessionId };
    
    try {
      const data = await routerPost(routerUrl, bodyWithSession, loginSessionId);
      if (data && (data.success === true || data.success === 'true')) {
        if (data.login_fail === 'fail' || data.login_fail2 === 'fail') {
          return null;
        }
        return {
          sessionId: data.sessionId || loginSessionId,
          token: data.token || ''
        };
      }
    } catch (e) {
      console.error(`[RouterSync] Variant attempt error for ${routerUrl}:`, e);
    }
    return null;
  }

  private static async getSessionToken(routerUrl: string): Promise<string> {
    for (const cmd of [233, 232]) {
      try {
        const data = await routerPost(routerUrl, { cmd, method: 'GET' });
        if (data && data.token) return data.token;
      } catch (e) {}
    }
    throw new Error(`No session token from router at ${routerUrl}`);
  }

  private static async getMacRules(config: RouterConfig): Promise<any> {
    let filtersData = await this.getRouterData(config, 23, { getfun: true });
    
    if (filtersData?.success === false) {
      filtersData = await this.getRouterData(config, 23);
    }
    
    if (filtersData?.success === false) {
      throw new Error(`[RouterSync] Failed to read MAC filter rules: ${JSON.stringify(filtersData)}`);
    }
    const data = filtersData || { isEnable: '1', filterPolite: '0', datas: [] };
    if (!Array.isArray(data.datas)) {
      data.datas = [];
    }
    return data;
  }

  /**
   * Build POST body for cmd:23 without letting GET response fields (e.g. method: "GET")
   * overwrite cmd/method — that bug prevented saves from applying on the router.
   */
  private static buildMacFilterSavePayload(filtersData: any, rules: any[], token?: string): Record<string, any> {
    const skip = new Set(['cmd', 'method', 'success', 'message', 'raw', 'datas', 'sessionId', 'token']);
    const rest: Record<string, any> = {};
    for (const [k, v] of Object.entries(filtersData || {})) {
      if (skip.has(k)) continue;
      rest[k] = v;
    }
    return {
      ...rest,
      cmd: 23,
      method: 'POST',
      token: token || filtersData?.token || '',
      success: true,
      datas: rules,
    };
  }

  private static async saveMacRules(config: RouterConfig, filtersData: any, rules: any[]): Promise<void> {
    const session = this.sessions.get(config.routerUrl);
    const payload = this.buildMacFilterSavePayload(filtersData, rules, session?.token);
    
    // Use getRouterData to ensure we handle tokens and retries correctly for the POST
    const saveRes = await this.getRouterData(config, 23, payload);
    
    if (saveRes?.success === false) {
      throw new Error(`[RouterSync] MAC filter save rejected: ${JSON.stringify(saveRes)}`);
    }
    
    // Apply changes
    const applyRes = await this.getRouterData(config, 20);
    if (applyRes?.success === false) {
      console.warn(`[RouterSync] Apply (cmd:20) response: ${JSON.stringify(applyRes)}`);
    }
  }

  static async toggleMacRule(config: RouterConfig, macAddress: string, userName: string, enable: boolean): Promise<void> {
    if (!isValidMacAddress(macAddress)) {
      throw new Error(`Invalid MAC address: ${macAddress}`);
    }

    const macRouter = formatMacForRouter(macAddress);

    const runOnce = async () => {
      // We no longer manually fetch sessionId here; getRouterData handles it
      const filtersData = await this.getMacRules(config);
      const rules = [...(filtersData.datas || [])];

      const normalizedTarget = macRouter.replace(/[:\-\s]/g, '').toLowerCase();
      const ruleIndex = rules.findIndex(
        (r: any) => String(r.mac || '').replace(/[:\-\s]/g, '').toLowerCase() === normalizedTarget
      );

      if (ruleIndex === -1) {
        if (!enable) {
          console.warn(
            `[RouterSync] MAC ${macRouter} not in router MAC filter list; nothing to disable.`
          );
          return;
        }
        console.log(`[RouterSync] Adding NEW MAC rule for ${userName} (${macRouter})`);
        rules.push({
          remark: userName,
          mac: macRouter,
          enableRule: 1,
          enableLink: 1,
        });
      } else {
        const row = rules[ruleIndex];
        if (isRuleEnabled(row) === enable) {
          console.log(`[RouterSync] MAC ${macRouter} already ${enable ? 'enabled' : 'disabled'} on router.`);
          // Even if enabled, let's update the remark if it's missing or different
          if (row.remark === userName) return;
        }
        
        console.log(`[RouterSync] UPDATING MAC rule for ${userName} (${macRouter}) -> ${enable ? 'ENABLE' : 'DISABLE'}`);
        rules[ruleIndex] = {
          ...row,
          remark: userName || row.remark,
          mac: formatMacForRouter(String(row.mac || macRouter)),
          enableRule: enable ? 1 : 0,
          enableLink: enable ? 1 : 0,
        };
      }

      if (!filtersData.hasOwnProperty('isEnable')) filtersData.isEnable = '1';
      if (!filtersData.hasOwnProperty('filterPolite')) filtersData.filterPolite = '0';

      await this.saveMacRules(config, filtersData, rules);
    };

    try {
      await runOnce();
    } catch (e: any) {
      console.error(`[RouterSync] Error in toggleMacRule (Attempt 1): ${e.message}`);
      this.sessions.delete(config.routerUrl);
      try {
        await runOnce();
      } catch (e2: any) {
        console.error(`[RouterSync] Error in toggleMacRule (Attempt 2 - Final): ${e2.message}`);
        throw e2;
      }
    }
  }

  public static async getRouterData(config: RouterConfig, cmd: number, extraBody: any = {}, sessionId?: string): Promise<any> {
    const sId = sessionId || await this.ensureLoggedIn(config);
    const session = this.sessions.get(config.routerUrl);
    
    try {
        const body = { 
            ...extraBody,
            cmd, 
            token: session?.token || extraBody.token || '',
            sessionId: sId
        };
        
        // Ensure method is POST for write commands, otherwise GET
        if (!body.method) {
            body.method = (cmd === 23 && !extraBody.getfun) || cmd === 20 || cmd === 100 ? 'POST' : 'GET';
        }

        const data = await routerPost(config.routerUrl, body, sId);
        
        // Comprehensive check for session expiration or unauthorized access
        const isAuthError = data && (
            data.message === 'NO_AUTH' ||
            data.error_code === 104 || 
            data.error === 104 || 
            data.error === 101
        );

        if (isAuthError) {
            console.warn(`[RouterSync] Session expired for ${config.routerUrl} (Cmd: ${cmd}). Response: ${JSON.stringify(data)}`);
            this.sessions.delete(config.routerUrl);
            // Only retry if we haven't already passed an explicit sessionId
            if (!sessionId) {
                const newSId = await this.ensureLoggedIn(config);
                const freshSession = this.sessions.get(config.routerUrl);
                
                const retryBody = { 
                    ...body, 
                    token: freshSession?.token || '',
                    sessionId: newSId
                };
                return await routerPost(config.routerUrl, retryBody, newSId);
            }
        }
        
        // Update token if returned in response
        if (data?.token && session) {
            session.token = data.token;
            session.lastUsed = Date.now();
        }

        return data;
    } catch (e: any) {
        // If it's a network error, clear session to be safe on next try
        if (e.message?.includes('fetch') || e.message?.includes('ECONN')) {
          this.sessions.delete(config.routerUrl);
        }
        throw e;
    }
  }

  public static async getSignalStatus(config: RouterConfig): Promise<any> {
    try {
      // Command 1018 provides both signal and traffic info in an array called device_info
      const response = await this.getRouterData(config, 1018);
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
      if (rsrpVal > -80) signalLevel = '5';
      else if (rsrpVal > -90) signalLevel = '4';
      else if (rsrpVal > -100) signalLevel = '3';
      else if (rsrpVal > -110) signalLevel = '2';
      else if (rsrpVal > -120) signalLevel = '1';

      return {
        rsrp,
        sinr,
        signalLevel,
        networkType: latest.network_type || 'N/A',
        enrch_rsrp: latest.rsrp_5g || '0',
        enrch_sinr: latest.sinr_5g || '0'
      };
    } catch (error) {
      console.error(`[RouterSync] Failed to get signal status for ${config.routerUrl}:`, error);
      throw error;
    }
  }

  public static async getConnectedDevices(config: RouterConfig): Promise<any[]> {
    try {
      const response = await this.getRouterData(config, 223);
      const deviceList = response.dhcp_list_info || response.device_list || response.list || [];
      return deviceList.map((dev: any) => ({
        id: dev.mac,
        mac: dev.mac,
        name: dev.host || dev.hostname || dev.name || 'Unknown Device',
        ip: dev.ip,
        isWhitelisted: false // Will be updated by the controller
      }));
    } catch (error) {
      console.error(`[RouterSync] Failed to get connected devices for ${config.routerUrl}:`, error);
      return [];
    }
  }

  public static async getTrafficStats(config: RouterConfig): Promise<any> {
    try {
      const response = await this.getRouterData(config, 1018);
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

      const parseRouterTime = (timeStr: string) => {
        // Format: "2026/04/06/12:18:33"
        const parts = timeStr.split(/[\/:]/);
        if (parts.length < 6) return Date.now();
        return new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
          parseInt(parts[3]),
          parseInt(parts[4]),
          parseInt(parts[5])
        ).getTime();
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
    } catch (error) {
      console.error(`[RouterSync] Failed to get traffic stats for ${config.routerUrl}:`, error);
      return { uploadSpeed: '0', downloadSpeed: '0' };
    }
  }
  
  public static async getSystemStatus(config: RouterConfig): Promise<any> {
    try {
      const [res1018, res120] = await Promise.all([
        this.getRouterData(config, 1018),
        this.getRouterData(config, 120).catch(() => ({}))
      ]);

      const latest = res1018.device_info?.[res1018.device_info.length - 1] || {};
      
      return {
        cpu: latest.cpu_usage || latest.cpuusage || '0',
        memory: latest.ram_usage || latest.ramusage || latest.mem_usage || latest.memusage || latest.memory_usage || '0',
        uptime: latest.sys_uptime || latest.sys_runtime || res120.runtime || res120.uptime || '0',
        wanIp: res120.wan_ip || res120.wanip || '---',
        model: res120.model_name || res120.modelname || 'ZLT X17M',
        firmware: res120.sw_version || res120.swversion || '---'
      };
    } catch (error) {
      console.error(`[RouterSync] Failed to get system status for ${config.routerUrl}:`, error);
      return { cpu: '0', memory: '0', uptime: '0', wanIp: '---' };
    }
  }

  static async syncUser(config: RouterConfig, user: IWifiUser): Promise<void> {
    if (!user.macAddress) return;
    await this.toggleMacRule(config, user.macAddress, user.name, user.status === 'active');
  }
}
