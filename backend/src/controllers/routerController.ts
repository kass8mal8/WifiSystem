import { Request, Response } from 'express';
import { RouterSync, RouterConfig } from '../utils/routerSync';
import User from '../models/User';

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
    
    res.json({
      devices,
      success: true
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
