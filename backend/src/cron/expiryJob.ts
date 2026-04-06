import cron from 'node-cron';
import WifiUser from '../models/WifiUser';
import { RouterSync } from '../utils/routerSync';

export const startExpiryJob = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Find active users who have expired
      const expiredUsers = await WifiUser.find({
        status: 'active',
        paymentExpiryDate: { $lt: now }
      });

      if (expiredUsers.length > 0) {
        console.log(`[Cron] Found ${expiredUsers.length} expired users. Syncing with router...`);
        
        for (const user of expiredUsers) {
          user.status = 'expired';
          await user.save();
          
          // Real Router Disconnect
          try {
            await RouterSync.syncUser(user);
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
