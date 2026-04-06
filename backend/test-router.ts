import { RouterSync } from './src/utils/routerSync';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log('--- RouterSync Debug Test ---');
  try {
    const signal = await RouterSync.getSignalStatus();
    console.log('Signal:', signal);
    
    const devices = await RouterSync.getConnectedDevices();
    console.log('Devices:', devices);
    
    const traffic = await RouterSync.getTrafficStats();
    console.log('Traffic:', traffic);
  } catch (e) {
    console.error('Test Failed:', e);
  }
}

test();
