import { Request, Response } from 'express';
import { RouterSync } from '../utils/routerSync';

export const getRouterStatus = async (req: Request, res: Response) => {
  try {
    const signal = await RouterSync.getSignalStatus();
    const traffic = await RouterSync.getTrafficStats();
    
    res.json({
      signal,
      traffic,
      success: true
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getConnectedDevices = async (req: Request, res: Response) => {
  try {
    const devices = await RouterSync.getConnectedDevices();
    res.json({
      devices,
      success: true
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
