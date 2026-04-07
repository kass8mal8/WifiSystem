import { Request, Response } from 'express';
import WifiUser from '../models/WifiUser';
import AuditLog from '../models/AuditLog';
import User from '../models/User';
import { RouterSync, RouterConfig } from '../utils/routerSync';

const getRouterConfig = (admin: any): RouterConfig => ({
  routerUrl: admin.routerUrl || 'http://192.168.1.1',
  routerUsername: admin.routerUsername || 'admin',
  routerPasswordRaw: admin.routerPassword || ''
});

export const getUsers = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const users = await WifiUser.find({ adminId }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const newUser = new WifiUser({ 
      ...req.body, 
      adminId,
      status: 'active' 
    });
    
    const savedUser = await newUser.save();

    // Audit Log
    try {
      await AuditLog.create({
        action: 'CREATE_USER',
        target: `${savedUser.name} (${savedUser.macAddress})`,
        performedBy: admin.name || admin.email,
        details: `Initial payment: ${savedUser.amountPaid} via ${savedUser.methodPaid}`,
      });
    } catch (logError) {
      console.error('[AuditLog Error]', logError);
    }

    let routerSyncWarning: string | null = null;
    try {
      const config = getRouterConfig(admin);
      await RouterSync.syncUser(config, savedUser);
    } catch (routerError: any) {
      routerSyncWarning = routerError?.message || 'Router sync failed after creating user.';
      console.error(`[Router] Create succeeded, but sync failed for ${savedUser.macAddress}: ${routerSyncWarning}`);
    }

    res.status(201).json({
      ...savedUser.toObject(),
      routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Ensure the user belongs to the logged-in admin
    const user = await WifiUser.findOneAndDelete({ _id: id, adminId });
    
    let routerSyncWarning: string | null = null;
    if (user) {
      // Audit Log
      try {
        await AuditLog.create({
          action: 'DELETE_USER',
          target: `${user.name} (${user.macAddress})`,
          performedBy: admin.name || admin.email,
          details: 'User deleted from system',
        });
      } catch (logError) {
        console.error('[AuditLog Error]', logError);
      }

      try {
        const config = getRouterConfig(admin);
        await RouterSync.toggleMacRule(config, user.macAddress, user.name, false);
      } catch (routerError: any) {
        routerSyncWarning = routerError?.message || 'Router sync failed after deleting user.';
        console.error(`[Router] Delete succeeded, but sync failed for ${user.macAddress}: ${routerSyncWarning}`);
      }
    } else {
      return res.status(404).json({ message: 'User not found or unauthorized' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const updateData = { ...req.body };
    
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (req.body.paymentExpiryDate) {
      updateData.status = 'active';
    }
    
    // Ensure ownership during update
    const updatedUser = await WifiUser.findOneAndUpdate(
      { _id: id, adminId }, 
      updateData, 
      { new: true }
    );

    let routerSyncWarning: string | null = null;

    if (updatedUser) {
      // Audit Log
      try {
        await AuditLog.create({
          action: req.body.paymentExpiryDate ? 'RENEW_SUBSCRIPTION' : 'UPDATE_USER',
          target: `${updatedUser.name} (${updatedUser.macAddress})`,
          performedBy: admin.name || admin.email,
          details: req.body.paymentExpiryDate ? `Renewed until ${new Date(req.body.paymentExpiryDate).toLocaleDateString()}` : 'User details updated',
        });
      } catch (logError) {
        console.error('[AuditLog Error]', logError);
      }

      try {
        const config = getRouterConfig(admin);
        await RouterSync.syncUser(config, updatedUser);
      } catch (routerError: any) {
        routerSyncWarning = routerError?.message || 'Router sync failed after updating user.';
        console.error(`[Router] Update succeeded, but sync failed for ${updatedUser.macAddress}: ${routerSyncWarning}`);
      }
    } else {
      return res.status(404).json({ message: 'User not found or unauthorized' });
    }

    res.status(200).json({
        ...updatedUser.toObject(),
        routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
