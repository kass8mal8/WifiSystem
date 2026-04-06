import { Server } from 'socket.io';
import { RouterSync } from './routerSync';

let isPollingActive = false;
let currentTimeout: NodeJS.Timeout | null = null;

/**
 * Starts a background loop that fetches router status and broadcasts it to all connected sockets.
 * Optimized to only poll when at least one admin is connected.
 * Uses recursive setTimeout to prevent "syncing cascades" on slow hardware.
 */
export const startRouterPolling = (io: Server) => {
  if (isPollingActive) return;
  isPollingActive = true;

  console.log('[RouterEmitter] Background real-time polling initialized...');

  const poll = async () => {
    if (!isPollingActive) return;

    try {
      const connectedClients = io.engine.clientsCount;
      
      if (connectedClients > 0) {
        console.log(`[RouterEmitter] Syncing hardware status for ${connectedClients} active clients...`);

        // Fetch all metrics in parallel for speed
        const [signal, traffic, system, devices] = await Promise.all([
          RouterSync.getSignalStatus().catch(e => {
            console.error('[RouterEmitter] Signal Error:', e.message);
            return { error: 'Signal Error' };
          }),
          RouterSync.getTrafficStats().catch(e => {
            console.error('[RouterEmitter] Traffic Error:', e.message);
            return { error: 'Traffic Error' };
          }),
          RouterSync.getSystemStatus().catch(e => {
            console.error('[RouterEmitter] System Status Error:', e.message);
            return { error: 'System Error' };
          }),
          RouterSync.getConnectedDevices().catch(e => {
            console.error('[RouterEmitter] Device Scan Error:', e.message);
            return [];
          })
        ]);

        // Broadcast to all connected clients
        io.emit('router_status', { 
            signal, 
            traffic, 
            system, 
            success: true,
            timestamp: Date.now()
        });
        
        io.emit('router_devices', { 
            devices, 
            success: true 
        });
      }
    } catch (error) {
      console.error('[RouterEmitter] Critical polling loop failure:', error);
    } finally {
      // Schedule the next poll only AFTER this one is done
      if (isPollingActive) {
        currentTimeout = setTimeout(poll, 5000); 
      }
    }
  };

  // Start the first poll
  poll();
};

export const stopRouterPolling = () => {
  isPollingActive = false;
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  console.log('[RouterEmitter] Polling loop suspended.');
};
