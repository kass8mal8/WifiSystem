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
        console.log(`[Cron] Found ${expiredUsers.length} expired users. Revoking access...`);
        
        for (const user of expiredUsers) {
          try {
            // Cast adminId to any to access properties after population
            const admin: any = user.adminId;
            
            user.status = 'expired';
            await user.save();
            console.log(`[Cron] User ${user.name} (${user.macAddress}) set to expired in DB.`);
            
            // Construct config for the admin
            const config = {
              routerUrl: admin?.routerUrl || process.env.ROUTER_URL || 'http://192.168.1.1',
              routerUsername: admin?.routerUsername || process.env.ROUTER_USERNAME || 'admin',
              routerPasswordRaw:
                (admin?.routerPassword && String(admin.routerPassword).trim() !== ''
                  ? admin.routerPassword
                  : process.env.ROUTER_PASSWORD) || '',
            };

            // Revoke on router
            await RouterSync.toggleMacRule(config, user.macAddress, user.name, false);
            console.log(`[Cron] Successfully disabled MAC filter for: ${user.name} (${user.macAddress})`);
          } catch (err: any) {
            console.error(`[Cron Error] Failed to process revocation for user: ${user.name}`, err.message);
          }
        }
      }
    } catch (error: any) {
      console.error('[Cron Error] Global error in expiry job:', error.message);
    }
  });
  
  console.log('[Cron] Expiry check job started (every minute)');
};
