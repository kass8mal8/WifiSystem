const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const ROUTER_URL = process.env.ROUTER_URL || 'http://192.168.1.1';
const CGI = `${ROUTER_URL}/cgi-bin/http.cgi`;

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex') + crypto.randomBytes(16).toString('hex');
}

async function probe() {
  const user = process.env.ROUTER_USERNAME || 'admin';
  const pass = process.env.ROUTER_PASSWORD || '';
  
  try {
    console.log('Logging in...');
    const resToken = await axios.post(CGI, { cmd: 233, method: 'GET' });
    const token = resToken.data.token;
    
    // Using one of the variants
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
    const res1018 = await axios.post(CGI, { cmd: 1018, method: 'GET', sessionId }, { headers: { 'Cookie': `sessionID=${sessionId}` } });
    const latest = res1018.data.device_info && res1018.data.device_info.length > 0 ? res1018.data.device_info[res1018.data.device_info.length - 1] : {};
    console.log('CMD 1018 Data Keys:', Object.keys(latest));
    
    console.log('Probing Command 120 (Hardware)...');
    const res120 = await axios.post(CGI, { cmd: 120, method: 'GET', sessionId }, { headers: { 'Cookie': `sessionID=${sessionId}` } });
    console.log('CMD 120 Data Keys:', Object.keys(res120.data));

    console.log('Probing Command 23 (MAC Filters)...');
    const res23 = await axios.post(CGI, { cmd: 23, method: 'GET', sessionId }, { headers: { 'Cookie': `sessionID=${sessionId}` } });
    console.log('CMD 23 Data:', JSON.stringify(res23.data, null, 2));

  } catch (err) {
    console.error('Probe failed:', err.message);
  }
}

probe();
