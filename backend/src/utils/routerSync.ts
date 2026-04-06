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
  // This avoids decodeURIComponent failures on non-encoded '%' characters.
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
    
    // Ensure method field is in the body if missing (default to GET-style response for most commands)
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
        // Log raw response for diagnostics if it's not JSON
        console.warn(`[RouterSync] Non-JSON response from ${url}: ${text.substring(0, 500)}`);
        return { raw: text };
    }
}

/**
 * Utility to synchronize user status with the Airtel 5G Router's MAC filtering rules.
 * Uses the router's REST API directly — no browser automation required.
 */
export class RouterSync {
  // Cache a known-good login variant to avoid repeated failed attempts.
  private static loginVariantIndex: number | null = null;



  /**
   * Step 2: Log in and return the authenticated session ID.
   */
  private static async login(): Promise<string> {
    const rawPass = process.env.ROUTER_PASSWORD || '';
    const user = process.env.ROUTER_USERNAME || 'admin';
    const pass = normalizeRouterPassword(rawPass);

    console.log(`[RouterSync] Starting login process...`);
    console.log(`[RouterSync] Credential check: user="${user}", pass="${pass.substring(0, 1)}***" (len: ${pass.length})`);
    
    const buildLoginVariants = (token: string) => {
      const candidates = Array.from(new Set([pass, rawPass].filter(Boolean)));
      console.log(`[RouterSync] Found ${candidates.length} password candidates.`);

      const variants: Array<{ name: string; requestSessionId: string; body: any }> = [];
      for (const candidate of candidates) {
        // --- 1. Common SHA256 Patterns ---
        
        // Variant: sha256(token + password)
        const sha_1 = crypto.createHash('sha256').update(token + candidate).digest('hex');
        variants.push({
          name: `sha256(token + pass)`,
          requestSessionId: token || generateSessionId(),
          body: { cmd: 100, method: 'POST', username: ROUTER_USERNAME, passwd: sha_1, isAutoUpgrade: '0', subcmd: 0 },
        });

        // Variant: sha256(username + sha256(password) + token)
        const shaPre = crypto.createHash('sha256').update(candidate).digest('hex');
        const sha_4 = crypto.createHash('sha256').update(ROUTER_USERNAME + shaPre + token).digest('hex');
        variants.push({
          name: `sha256(user + sha256(pass) + token)`,
          requestSessionId: token || generateSessionId(),
          body: { cmd: 100, method: 'POST', username: ROUTER_USERNAME, passwd: sha_4, isAutoUpgrade: '0', subcmd: 0 },
        });

        // --- 2. Common MD5 Patterns ---
        
        // Variant: md5(token + password)
        const md5_1 = crypto.createHash('md5').update(token + candidate).digest('hex');
        variants.push({
          name: `md5(token + pass)`,
          requestSessionId: token || generateSessionId(),
          body: { cmd: 100, method: 'POST', username: ROUTER_USERNAME, passwd: md5_1, isAutoUpgrade: '0', subcmd: 0 },
        });

        // Variant: md5(password + token)
        const md5_2 = crypto.createHash('md5').update(candidate + token).digest('hex');
        variants.push({
          name: `md5(pass + token)`,
          requestSessionId: token || generateSessionId(),
          body: { cmd: 100, method: 'POST', username: ROUTER_USERNAME, passwd: md5_2, isAutoUpgrade: '0', subcmd: 0 },
        });

        // Variant: md5(username + password + token) - common for ZLT X17M
        const md5_3 = crypto.createHash('md5').update(ROUTER_USERNAME + candidate + token).digest('hex');
        variants.push({
          name: `md5(user + pass + token)`,
          requestSessionId: token || generateSessionId(),
          body: { cmd: 100, method: 'POST', username: ROUTER_USERNAME, passwd: md5_3, isAutoUpgrade: '0', subcmd: 0 },
        });
      }

      return variants;
    };

    const isLocked = (data: any): boolean => 
      (data?.login_fail === 'fail' && Number(data?.login_time || '0') > 0) || 
      (data?.error_code === 103) ||
      (data?.login_fail === 'lock_account');
    
    const getSessionToken = async () => {
      // Try GET_NEXT_LOGIN_TIME (233) first as seen in login.js, fallback to GET_SESSION_TOKEN (232)
      for (const cmd of [233, 232]) {
        try {
          const data = await routerPost({ cmd, method: 'GET' });
          if (data && data.token) {
            console.log(`[RouterSync] Got session token using cmd ${cmd}: ${data.token.substring(0, 8)}...`);
            return data.token;
          }
        } catch (e) {
          console.log(`[RouterSync] Cmd ${cmd} failed or returned no token.`);
        }
      }
      throw new Error('Failed to get session token from router.');
    };

    const generateRouterSessionId = () => {
        const r1 = Math.random().toString();
        const r2 = Math.random().toString();
        return crypto.createHash('md5').update(r1).digest('hex') + 
               crypto.createHash('md5').update(r2).digest('hex');
    };

    const tryVariant = async (variant: { name: string; body: any }) => {
      console.log(`[RouterSync] Attempting variant: ${variant.name}...`);
      // Start a fresh session for each login attempt as seen in login.js
      const loginSessionId = generateRouterSessionId();
      const bodyWithSession = { ...variant.body, sessionId: loginSessionId };
      
      const data = await routerPost(bodyWithSession, loginSessionId);
      console.log(`[RouterSync] Response: ${JSON.stringify(data)}`);
      
      if (data && (data.success === true || data.success === 'true')) {
        // Double check login_fail status which is a ZLT quirk
        if (data.login_fail === 'fail' || data.login_fail2 === 'fail') {
          console.log(`[RouterSync] Login command accepted but credentials REJECTED.`);
          return null;
        }
        return data.sessionId || loginSessionId; // Return the authenticated session
      }
      
      if (isLocked(data)) {
        throw new Error(`Router login locked. Response: ${JSON.stringify(data)}`);
      }

      return null;
    };

    const bootstrapToken = await getSessionToken();
    const variants = buildLoginVariants(bootstrapToken);
    
    for (const variant of variants) {
      const authenticatedSessionId = await tryVariant(variant);
      if (authenticatedSessionId) {
        console.log(`[RouterSync] Login successful! Session: ${authenticatedSessionId.substring(0, 8)}...`);
        return authenticatedSessionId;
      }
    }

    throw new Error('Router login failed for all supported variants. Please verify your ROUTER_PASSWORD in .env');
  }

  /**
   * Step 3: Read all current MAC filtering rules from the router (cmd: 23 GET).
   */
  private static async getMacRules(sessionId: string): Promise<MacRule[]> {
    const stationsData = await routerPost({ cmd: 120, sessionId });
    const filtersData = await routerPost({ cmd: 121, sessionId });
    const currentRules: MacRule[] = filtersData?.datas || [];
    console.log(`[RouterSync] Fetched ${currentRules.length} MAC rules from router.`);
    return currentRules;
  }

  /**
   * Step 4: Write the updated MAC rules back to the router and apply them.
   * cmd:23 POST saves the full ruleset, cmd:20 POST applies/commits it.
   */
  private static async saveMacRules(sessionId: string, rules: MacRule[]): Promise<void> {
    const saveData = await routerPost({
      cmd: 23,
      method: 'POST',
      success: true,
      datas: rules,
    }, sessionId);
    console.log(`[RouterSync] Save response: ${JSON.stringify(saveData)}`);

    // Equivalent to clicking "Save And Apply Rules" in the UI
    const applyData = await routerPost({ cmd: 20, method: 'POST' }, sessionId);
    console.log(`[RouterSync] Apply response: ${JSON.stringify(applyData)}`);
  }

  /**
   * Enables or disables internet access for a device by MAC address.
   *
   * - If the MAC is already in the router's rule list → toggles enableRule.
   * - If the MAC is NOT found and enable=true → adds a new rule (e.g. on renewal or new user).
   * - If the MAC is NOT found and enable=false → logs a warning and skips (nothing to block).
   */
  static async toggleMacRule(macAddress: string, userName: string, enable: boolean): Promise<void> {
    console.log(`[RouterSync] ${enable ? 'ENABLING' : 'DISABLING'} access for "${userName}" (${macAddress})`);

    if (!isValidMacAddress(macAddress)) {
      throw new Error(`[RouterSync] Invalid MAC address format: "${macAddress}". Expected 12 hex characters.`);
    }

    const sessionId = await this.login();
    const rules = await this.getMacRules(sessionId);

    // Normalize MAC for comparison (strip colons, dashes, spaces; lowercase)
    const normalizedTarget = macAddress.replace(/[:\-\s]/g, '').toLowerCase();
    const ruleIndex = rules.findIndex(
      r => r.mac.replace(/[:\-\s]/g, '').toLowerCase() === normalizedTarget
    );

    if (ruleIndex === -1) {
      if (!enable) {
        // MAC not on the list and we want to block — nothing to do
        console.warn(`[RouterSync] MAC ${macAddress} not found in router rules. Nothing to disable.`);
        return;
      }

      // MAC not on the list but we want to enable — add a new rule
      console.log(`[RouterSync] MAC ${macAddress} not found. Adding new rule for "${userName}".`);
      const newRule: MacRule = {
        remark: userName,
        mac: macAddress,
        enableRule: true,
        enableLink: true,
      };
      rules.push(newRule);
      await this.saveMacRules(sessionId, rules);
      console.log(`[RouterSync] New MAC rule added for ${macAddress}.`);
      return;
    }

    // Rule exists — check if already in desired state
    if (rules[ruleIndex].enableRule === enable) {
      console.log(`[RouterSync] Rule for ${macAddress} already ${enable ? 'enabled' : 'disabled'}. No change needed.`);
      return;
    }

    // Update the rule
    rules[ruleIndex] = { ...rules[ruleIndex], enableRule: enable };
    console.log(`[RouterSync] Updating rule "${rules[ruleIndex].remark}" → enableRule: ${enable}`);

    await this.saveMacRules(sessionId, rules);
    console.log(`[RouterSync] Successfully updated MAC rule for ${macAddress}.`);
  }

  /**
   * Sync a WifiUser with the router.
   * Active users have their MAC rule enabled; expired users get blocked.
   */
  static async syncUser(user: IWifiUser): Promise<void> {
    if (!user.macAddress) {
      console.warn(`[RouterSync] Skipping "${user.name}" — no MAC address set.`);
      return;
    }

    // Propagate errors so controllers/UI know the router sync failed
    await this.toggleMacRule(user.macAddress, user.name, user.status === 'active');
  }
}
