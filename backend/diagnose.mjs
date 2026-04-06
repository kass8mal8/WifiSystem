import crypto from 'crypto';
import { config } from 'dotenv';
config();

const ROUTER_URL = process.env.ROUTER_URL || 'http://192.168.1.1';
const ROUTER_PASSWORD = process.env.ROUTER_PASSWORD || '';
const ROUTER_USERNAME = process.env.ROUTER_USERNAME || 'admin';

console.log('=== RouterSync Login Diagnostic ===');
console.log('Router URL:', ROUTER_URL);
console.log('Username:', ROUTER_USERNAME);
console.log('Password length:', ROUTER_PASSWORD.length);
console.log('Password bytes:', [...ROUTER_PASSWORD].map(c => `${c}(${c.charCodeAt(0)})`).join(' '));

const res = await fetch(ROUTER_URL + '/cgi-bin/http.cgi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  body: JSON.stringify({ sessionId: '', language: 'EN', cmd: 232, method: 'GET' }),
});
const data = await res.json();
const token = data.token || data.sessionId || '';
console.log('\nToken received:', token);

const hash = crypto.createHash('sha256').update(token + ROUTER_PASSWORD).digest('hex');
console.log('Node SHA256(token + password):', hash);

console.log('\n--- BROWSER VERIFICATION (paste in http://192.168.1.1 DevTools console) ---');
console.log(`sha256_digest("${token}" + "${ROUTER_PASSWORD}")`);
console.log('Expected:', hash);
