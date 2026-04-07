import { Request, Response } from 'express';
import { RouterSync, RouterConfig } from '../utils/routerSync';
import User from '../models/User';
import WifiUser from '../models/WifiUser';

const getRouterConfig = (admin: any): RouterConfig => ({
  routerUrl: admin.routerUrl || 'http://192.168.1.1',
  routerUsername: admin.routerUsername || 'admin',
  routerPasswordRaw: admin.routerPassword || ''
});

export const getRouterStatus = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found', success: false });

    const config = getRouterConfig(admin);
    
    const [signal, traffic, system] = await Promise.all([
      RouterSync.getSignalStatus(config),
      RouterSync.getTrafficStats(config),
      RouterSync.getSystemStatus(config)
    ]);
    
    res.json({
      signal,
      traffic,
      system,
      success: true
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getConnectedDevices = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found', success: false });

    const config = getRouterConfig(admin);
    const devices = await RouterSync.getConnectedDevices(config);
    
    // Fetch users for this admin
    const users = await WifiUser.find({ adminId });
    const userMacMap = new Map();
    users.forEach(u => {
      if (u.macAddress) {
        userMacMap.set(u.macAddress.replace(/[:\-\s]/g, '').toLowerCase(), { name: u.name, status: u.status });
      }
    });

    const enrichedDevices = devices.map((dev: any) => {
      const normalizedMac = dev.mac.replace(/[:\-\s]/g, '').toLowerCase();
      if (userMacMap.has(normalizedMac)) {
        const matchingUser = userMacMap.get(normalizedMac);
        dev.name = matchingUser.name;
        // Optional: indicate whitelist status accurately based on active DB presence
        dev.isWhitelisted = matchingUser.status === 'active';
      }
      return dev;
    });
    
    res.json({
      devices: enrichedDevices,
      success: true
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
