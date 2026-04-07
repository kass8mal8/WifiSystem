import cron from 'node-cron';
import WifiUser from '../models/WifiUser';
import { RouterSync } from '../utils/routerSync';

export const startExpiryJob = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Find active users who have expired and populate their admin info
      const expiredUsers = await WifiUser.find({
        status: 'active',
        paymentExpiryDate: { $lt: now }
      }).populate('adminId');

      if (expiredUsers.length > 0) {
        console.log(`[Cron] Found ${expiredUsers.length} expired users. Syncing with router...`);
        
        for (const user of expiredUsers) {
          // Cast adminId to any to access properties after population
          const admin: any = user.adminId;
          
          user.status = 'expired';
          await user.save();
          
          // Construct config for the admin
          const config = {
            routerUrl: admin?.routerUrl || process.env.ROUTER_URL || 'http://192.168.1.1',
            routerUsername: admin?.routerUsername || process.env.ROUTER_USERNAME || 'admin',
            routerPasswordRaw: admin?.routerPassword || process.env.ROUTER_PASSWORD || ''
          };

          // Real Router Disconnect
          try {
            await RouterSync.syncUser(config, user);
            console.log(`[Router] Successfully disabled access for MAC: ${user.macAddress} (User: ${user.name})`);
          } catch (err) {
            console.error(`[Router Sync Error] Failed for user: ${user.name}`, err);
          }
        }
      }
    } catch (error) {
      console.error('[Cron Error]', error);
    }
  });
  
  console.log('[Cron] Expiry check job started (every minute)');
};
