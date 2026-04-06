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

/**
 * Posts a JSON command to the router's CGI API.
 */
async function routerPost(body: object, sessionId: string = ''): Promise<any> {
  const res = await fetch(CGI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ sessionId, language: 'EN', ...body }),
  });

  if (!res.ok) {
    throw new Error(`[RouterSync] HTTP error ${res.status} from router CGI.`);
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`[RouterSync] Failed to parse router response: ${text}`);
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
   * Step 1: Get a fresh session token from the router (cmd: 232).
   * This token is required to compute the password hash for login.
   */
  private static async getSessionToken(): Promise<string> {
    const data = await routerPost({ cmd: 232, method: 'GET' });
    const token = data?.token || data?.sessionId || '';
    if (!token) {
      throw new Error(`[RouterSync] Could not obtain session token. Response: ${JSON.stringify(data)}`);
    }
    console.log(`[RouterSync] Got session token: ${token.substring(0, 16)}...`);
    return token;
  }

  /**
   * Step 2: Log in and return the authenticated session ID.
   * Per router login.js: passwd = sha256(token + plainPassword)
   */
  private static async login(): Promise<string> {
    const buildLoginVariants = (token: string) => {
      const candidates = Array.from(
        new Set([ROUTER_PASSWORD, ROUTER_PASSWORD_RAW].filter(Boolean))
      );

      const variants: Array<{ requestSessionId: string; body: any }> = [];
      for (const candidate of candidates) {
        const hashTokenThenPass = crypto.createHash('sha256').update(token + candidate).digest('hex');

        variants.push({
          // Mirrors login.js: sessionId=random, passwd=sha256(token + passwd)
          requestSessionId: generateSessionId(),
          body: {
            cmd: 100,
            method: 'POST',
            username: ROUTER_USERNAME,
            passwd: hashTokenThenPass,
            isAutoUpgrade: '0',
            subcmd: 0,
          },
        });
      }

      return variants;
    };

    const isLocked = (data: any): boolean => data?.login_fail === 'fail' && Number(data?.login_time || '0') > 0;
    const isSuccess = (data: any): boolean =>
      !!data?.sessionId && data?.success !== false && data?.login_fail !== 'fail';

    const tryVariant = async (variantIndex: number): Promise<string | null> => {
      const token = await this.getSessionToken();
      const variants = buildLoginVariants(token);
      const variant = variants[variantIndex];
      const data = await routerPost(variant.body, variant.requestSessionId);
      console.log(`[RouterSync] Login response (variant ${variantIndex + 1}): ${JSON.stringify(data)}`);

      if (isSuccess(data)) {
        this.loginVariantIndex = variantIndex;
        console.log(`[RouterSync] Login successful using variant ${variantIndex + 1}.`);
        return data.sessionId;
      }

      if (isLocked(data)) {
        const lockTime = data?.login_time ? ` Router locked for ${data.login_time}s.` : '';
        throw new Error(`Router login failed due to invalid credentials.${lockTime}`);
      }

      return null;
    };

    // If we already discovered a working variant, try it first and only.
    if (this.loginVariantIndex !== null) {
      const sessionId = await tryVariant(this.loginVariantIndex);
      if (sessionId) return sessionId;
      // Firmware behavior may have changed; clear cache and continue fallback.
      this.loginVariantIndex = null;
    }

    // Try minimal safe variants only. Stop immediately on lockout.
    const bootstrapToken = await this.getSessionToken();
    const variantCount = buildLoginVariants(bootstrapToken).length;
    for (let i = 0; i < variantCount; i++) {
      const sessionId = await tryVariant(i);
      if (sessionId) return sessionId;
    }

    throw new Error('Router login failed for all supported Airtel/ZLT login variants. Verify router username/password.');
  }

  /**
   * Step 3: Read all current MAC filtering rules from the router (cmd: 23 GET).
   */
  private static async getMacRules(sessionId: string): Promise<MacRule[]> {
    const data = await routerPost({ cmd: 23, method: 'GET', getfun: true }, sessionId);
    const rules: MacRule[] = data?.datas || [];
    console.log(`[RouterSync] Fetched ${rules.length} MAC rules from router.`);
    return rules;
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
