import { Server } from 'socket.io';
import { RouterSync } from './routerSync';
import User from '../models/User';
import WifiUser from '../models/WifiUser';

let isPollingActive = false;
let currentTimeout: NodeJS.Timeout | null = null;

/**
 * Starts a background loop that fetches router status and broadcasts it to specific users.
 * Optimized to only poll when at least one user is connected via Socket.io.
 * Data is isolated per user based on their specific router configuration.
 */
export const startRouterPolling = (io: Server) => {
  if (isPollingActive) return;
  isPollingActive = true;

  console.log('[RouterEmitter] Background multi-tenant polling initialized...');

  const poll = async () => {
    if (!isPollingActive) return;

    try {
      // Get all connected user rooms
      const rooms = Array.from(io.sockets.adapter.rooms.keys());
      const userRooms = rooms.filter(room => room.startsWith('user:'));
      
      if (userRooms.length > 0) {
        const userIds = userRooms.map(room => room.split(':')[1]);
        
        // Fetch user data for all connected users
        const activeUsers = await User.find({ _id: { $in: userIds } });
        
        if (activeUsers.length > 0) {
            // Map routers to the users who use them to avoid redundant polling
            const routerMap = new Map<string, { config: any, users: any[] }>();
            
            for (const user of activeUsers) {
              if (!user.routerUrl) continue;
              
              const urlKey = user.routerUrl.toLowerCase().trim();
              if (!routerMap.has(urlKey)) {
                routerMap.set(urlKey, {
                  config: {
                    routerUrl: user.routerUrl,
                    routerUsername: user.routerUsername,
                    routerPasswordRaw: user.routerPassword // FIXED: Must be routerPasswordRaw for RouterSync
                  },
                  users: []
                });
              }
              routerMap.get(urlKey)?.users.push(user);
            }

            // Poll each unique router
            for (const [url, data] of routerMap.entries()) {
              try {
                const config = data.config;
                
                // Parallel fetch for speed
                const [signal, traffic, system, devices] = await Promise.all([
                  RouterSync.getSignalStatus(config).catch(e => {
                    console.error(`[RouterEmitter] Signal Error (${url}):`, e.message);
                    return { error: 'Signal Error' };
                  }),
                  RouterSync.getTrafficStats(config).catch(e => {
                    console.error(`[RouterEmitter] Traffic Error (${url}):`, e.message);
                    return { error: 'Traffic Error' };
                  }),
                  RouterSync.getSystemStatus(config).catch(e => {
                    console.error(`[RouterEmitter] System Error (${url}):`, e.message);
                    return { error: 'System Error' };
                  }),
                  RouterSync.getConnectedDevices(config).catch(e => {
                    console.error(`[RouterEmitter] Devices Error (${url}):`, e.message);
                    return [];
                  })
                ]);

                // Emit to each user connected to THIS router
                for (const user of data.users) {
                  const roomName = `user:${user._id}`;
                  
                  io.to(roomName).emit('router_status', { 
                      signal, 
                      traffic, 
                      system, 
                      success: true,
                      timestamp: Date.now()
                  });
                  
                  // Enrich devices specifically for this user
                  try {
                      const wifiUsers = await WifiUser.find({ adminId: user._id });
                      const userMacMap = new Map();
                      wifiUsers.forEach((u: any) => {
                        if (u.macAddress) {
                          userMacMap.set(u.macAddress.replace(/[:\-\s]/g, '').toLowerCase(), { name: u.name, status: u.status });
                        }
                      });
                      
                      const enrichedDevices = devices.map((dev: any) => {
                        const newDev = { ...dev }; // Copy to prevent shared state interference among multiple admins
                        const normalizedMac = newDev.mac.replace(/[:\-\s]/g, '').toLowerCase();
                        if (userMacMap.has(normalizedMac)) {
                          const matchingUser = userMacMap.get(normalizedMac);
                          newDev.name = matchingUser.name;
                          newDev.isWhitelisted = matchingUser.status === 'active';
                        }
                        return newDev;
                      });

                      io.to(roomName).emit('router_devices', { 
                          devices: enrichedDevices, 
                          success: true 
                      });
                  } catch (e) {
                      io.to(roomName).emit('router_devices', { devices, success: true });
                  }
                }

              } catch (error) {
                console.error(`[RouterEmitter] Error polling router at ${url}:`, error);
              }
            }
        }
      }
    } catch (error) {
      console.error('[RouterEmitter] Critical polling logic failure:', error);
    } finally {
      if (isPollingActive) {
        currentTimeout = setTimeout(poll, 5000); 
      }
    }
  };

  poll();
};

export const stopRouterPolling = () => {
  if (!isPollingActive) return;
  isPollingActive = false;
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  console.log('[RouterEmitter] Polling loop suspended.');
};
