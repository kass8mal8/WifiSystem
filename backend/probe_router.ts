import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ROUTER_URL = process.env.ROUTER_URL || 'http://192.168.1.1';
const CGI = `${ROUTER_URL}/cgi-bin/http.cgi`;

function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex') + crypto.randomBytes(16).toString('hex');
}

async function probe() {
  const user = process.env.ROUTER_USERNAME || 'admin';
  const pass = process.env.ROUTER_PASSWORD || '';
  
  console.log('Logging in...');
  const resToken = await axios.post(CGI, { cmd: 233, method: 'GET' });
  const token = resToken.data.token;
  const sha = crypto.createHash('sha256').update(token + pass).digest('hex');
  const sessionId = generateSessionId();
  
  await axios.post(CGI, { 
    cmd: 100, 
    method: 'POST', 
    username: user, 
    passwd: sha, 
    sessionId 
  }, { headers: { 'Cookie': `sessionID=${sessionId}` } });

  console.log('Probing Command 1018 (Stats)...');
  const res1018 = await axios.post(CGI, { cmd: 1018 }, { headers: { 'Cookie': `sessionID=${sessionId}` } });
  console.log('CMD 1018 Latest Info:', JSON.stringify(res1018.data.device_info?.[res1018.data.device_info.length - 1], null, 2));

  console.log('Probing Command 120 (Info)...');
  const res120 = await axios.post(CGI, { cmd: 120 }, { headers: { 'Cookie': `sessionID=${sessionId}` } });
  console.log('CMD 120 Info:', JSON.stringify(res120.data, null, 2));
}

probe().catch(console.error);
