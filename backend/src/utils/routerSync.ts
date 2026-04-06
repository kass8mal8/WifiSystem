import crypto from 'crypto';
import { IWifiUser } from '../models/WifiUser';

/**
 * Generates a random 32-byte hex string to use as a session ID,
 * mimicking the browser's: Md5.md5(Math.random()) + Md5.md5(Math.random())
 */
function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex') + crypto.randomBytes(16).toString('hex');
}

// env vars are loaded by index.ts at startup
const ROUTER_URL = process.env.ROUTER_URL || 'http://192.168.1.1';
const ROUTER_USERNAME = process.env.ROUTER_USERNAME || 'admin';
const ROUTER_PASSWORD_RAW = process.env.ROUTER_PASSWORD || '';
const CGI = `${ROUTER_URL}/cgi-bin/http.cgi`;

function normalizeRouterPassword(input: string): string {
  // Decode only valid %HH bytes so strings like "%m%22" become "%m\"".
  return input.replace(/%([0-9a-fA-F]{2})/g, (_match, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

const ROUTER_PASSWORD = normalizeRouterPassword(ROUTER_PASSWORD_RAW);

interface MacRule {
  remark: string;
  mac: string;
  enableRule: boolean;
  enableLink: boolean;
  [key: string]: any;
}

function isValidMacAddress(mac: string): boolean {
  const normalized = mac.replace(/[:\-\s]/g, '');
  return /^[0-9a-fA-F]{12}$/.test(normalized);
}

async function routerPost(body: any, sessionId: string = ''): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json; charset=UTF-8',
    };

    if (sessionId) {
        headers['Cookie'] = `sessionID=${sessionId}`;
    }

    const timestamp = Date.now();
    const url = `${CGI}?_t=${timestamp}`;
    
    const finalBody = {
        ...body,
        method: body.method || 'GET',
        sessionId: body.sessionId || sessionId || '',
        language: body.language || 'EN'
    };

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(finalBody),
    });
    const text = await res.text();

    if (!res.ok) {
        console.error(`[RouterSync] HTTP ${res.status} from ${url}. Body: ${text}`);
        throw new Error(`[RouterSync] HTTP error ${res.status} from router.`);
    }

    try {
        return JSON.parse(text);
    } catch {
        console.warn(`[RouterSync] Non-JSON response from ${url}: ${text.substring(0, 500)}`);
        return { raw: text };
    }
}

/**
 * Utility to synchronize user status with the Airtel 5G Router's MAC filtering rules.
 */
export class RouterSync {
  private static cachedSessionId: string | null = null;
  private static loginVariantIndex: number | null = null;
  private static lastLoginAttemptTime: number = 0;
  private static loginPromise: Promise<string> | null = null;

  /**
   * Main entry point to get an authenticated session, handles caching.
   */
  private static async ensureLoggedIn(): Promise<string> {
    if (this.cachedSessionId) {
      return this.cachedSessionId;
    }

    if (this.loginPromise) {
      return this.loginPromise;
    }

    this.loginPromise = (async () => {
      try {
        const now = Date.now();
        if (now - this.lastLoginAttemptTime < 5000) {
          console.warn(`[RouterSync] Login requested too soon. Waiting...`);
          await new Promise(r => setTimeout(r, 2000));
        }

        this.lastLoginAttemptTime = Date.now();
        const sid = await this.login();
        this.cachedSessionId = sid;
        return sid;
      } finally {
        this.loginPromise = null;
      }
    })();

    return this.loginPromise;
  }

  /**
   * Step 2: Log in and return the authenticated session ID.
   */
  private static async login(): Promise<string> {
    const rawPass = process.env.ROUTER_PASSWORD || '';
    const user = process.env.ROUTER_USERNAME || 'admin';
    const pass = normalizeRouterPassword(rawPass);

    console.log(`[RouterSync] Starting login discovery...`);
    
    const bootstrapToken = await this.getSessionToken();
    const variants = this.buildLoginVariants(bootstrapToken, user, pass, rawPass);
    
    // Prioritize working variant
    const sortedIndices = Array.from(variants.keys());
    if (this.loginVariantIndex !== null && this.loginVariantIndex < variants.length) {
      sortedIndices.splice(sortedIndices.indexOf(this.loginVariantIndex), 1);
      sortedIndices.unshift(this.loginVariantIndex);
    }

    for (const idx of sortedIndices) {
      const variant = variants[idx];
      const sessionId = await this.tryVariant(variant);
      
      if (sessionId) {
        console.log(`[RouterSync] Successfully logged in using "${variant.name}"`);
        this.loginVariantIndex = idx;
        return sessionId;
      }
    }

    throw new Error('Router login failed for all variants. Check credentials in .env');
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

  private static async tryVariant(variant: { name: string; body: any }) {
    console.log(`[RouterSync] Trying variant: ${variant.name}`);
    const loginSessionId = generateSessionId();
    const bodyWithSession = { ...variant.body, sessionId: loginSessionId };
    
    try {
      const data = await routerPost(bodyWithSession, loginSessionId);
      if (data && (data.success === true || data.success === 'true')) {
        if (data.login_fail === 'fail' || data.login_fail2 === 'fail') {
          return null;
        }
        return data.sessionId || loginSessionId;
      }
    } catch (e) {
      console.error(`[RouterSync] Variant attempt error:`, e);
    }
    return null;
  }

  private static async getSessionToken(): Promise<string> {
    for (const cmd of [233, 232]) {
      try {
        const data = await routerPost({ cmd, method: 'GET' });
        if (data && data.token) return data.token;
      } catch (e) {}
    }
    throw new Error('No session token from router');
  }

  private static async getMacRules(sessionId: string): Promise<MacRule[]> {
    const filtersData = await routerPost({ cmd: 23 }, sessionId);
    return filtersData?.datas || [];
  }

  private static async saveMacRules(sessionId: string, rules: MacRule[]): Promise<void> {
    await routerPost({ cmd: 23, method: 'POST', datas: rules }, sessionId);
    await routerPost({ cmd: 20 }, sessionId);
  }

  static async toggleMacRule(macAddress: string, userName: string, enable: boolean): Promise<void> {
    if (!isValidMacAddress(macAddress)) {
      throw new Error(`Invalid MAC address: ${macAddress}`);
    }

    const sessionId = await this.ensureLoggedIn();
    let rules = await this.getMacRules(sessionId);

    const normalizedTarget = macAddress.replace(/[:\-\s]/g, '').toLowerCase();
    const ruleIndex = rules.findIndex(
      r => r.mac.replace(/[:\-\s]/g, '').toLowerCase() === normalizedTarget
    );

    if (ruleIndex === -1) {
      if (!enable) return;
      rules.push({ remark: userName, mac: macAddress, enableRule: true, enableLink: true });
    } else {
      if (rules[ruleIndex].enableRule === enable) return;
      rules[ruleIndex].enableRule = enable;
    }

    await this.saveMacRules(sessionId, rules);
  }

  public static async getRouterData(cmd: number, sessionId?: string): Promise<any> {
    const sId = sessionId || await this.ensureLoggedIn();
    try {
        const data = await routerPost({ cmd }, sId);
        // If router session expired (Error 104), clear cache and retry once
        if (data && data.error_code === 104) {
            console.log(`[RouterSync] Session expired (104). Re-authenticating...`);
            this.cachedSessionId = null;
            const newSId = await this.ensureLoggedIn();
            return await routerPost({ cmd }, newSId);
        }
        return data;
    } catch (e) {
        this.cachedSessionId = null;
        throw e;
    }
  }

  public static async getSignalStatus(): Promise<any> {
    try {
      // Command 1018 provides both signal and traffic info in an array called device_info
      const response = await this.getRouterData(1018);
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
      console.error('[RouterSync] Failed to get signal status:', error);
      throw error;
    }
  }

  public static async getConnectedDevices(): Promise<any[]> {
    try {
      const response = await this.getRouterData(223);
      const deviceList = response.dhcp_list_info || response.device_list || response.list || [];
      return deviceList.map((dev: any) => ({
        id: dev.mac,
        mac: dev.mac,
        name: dev.host || dev.hostname || dev.name || 'Unknown Device',
        ip: dev.ip,
        isWhitelisted: false // Will be updated by the controller
      }));
    } catch (error) {
      console.error('[RouterSync] Failed to get connected devices:', error);
      return [];
    }
  }

  public static async getTrafficStats(): Promise<any> {
    try {
      const response = await this.getRouterData(1018);
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

      // Speed in KB/s (assuming flows are in MB)
      const dlSpeed = dlDiff > 0 ? (dlDiff * 1024 / seconds).toFixed(2) : '0.00';
      const ulSpeed = ulDiff > 0 ? (ulDiff * 1024 / seconds).toFixed(2) : '0.00';

      return {
        uploadSpeed: ulSpeed,
        downloadSpeed: dlSpeed
      };
    } catch (error) {
      console.error('[RouterSync] Failed to get traffic stats:', error);
      return { uploadSpeed: '0', downloadSpeed: '0' };
    }
  }

  static async syncUser(user: IWifiUser): Promise<void> {
    if (!user.macAddress) return;
    await this.toggleMacRule(user.macAddress, user.name, user.status === 'active');
  }
}
