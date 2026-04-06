import dotenv from 'dotenv';
import path from 'path';

// Load env vars BEFORE importing RouterSync
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { RouterSync } from './src/utils/routerSync';

async function test() {
    console.log('--- Router Sync Diagnostic Test ---');
    console.log('Target Router:', process.env.ROUTER_IP || '192.168.1.1');
    console.log('Model Identified: ZLT X17M (Software 6.10.9)');
    
    try {
        // We just need to trigger a login to see the logs
        // @ts-ignore - access private static method for testing
        const sessionId = await RouterSync.login();
        console.log('SUCCESS! Authenticated Session ID:', sessionId);
    } catch (error: any) {
        console.error('FAILED during diagnostic test:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

test();
