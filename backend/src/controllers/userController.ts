import { Request, Response } from 'express';
import WifiUser from '../models/WifiUser';
import { RouterSync } from '../utils/routerSync';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await WifiUser.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new WifiUser({ ...req.body, status: 'active' });
    const savedUser = await newUser.save();

    // Keep CRUD reliable even when router authentication is temporarily failing.
    let routerSyncWarning: string | null = null;
    try {
      await RouterSync.syncUser(savedUser);
      console.log(`[Router] Access ENABLED for MAC: ${savedUser.macAddress} (User: ${savedUser.name})`);
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await WifiUser.findByIdAndDelete(id);
    let routerSyncWarning: string | null = null;
    if (user) {
      // Disable the MAC rule on the router when a user is deleted
      try {
        await RouterSync.toggleMacRule(user.macAddress, user.name, false);
        console.log(`[Router] ACCESS REVOKED for MAC: ${user.macAddress} (User: ${user.name})`);
      } catch (routerError: any) {
        routerSyncWarning = routerError?.message || 'Router sync failed after deleting user.';
        console.error(`[Router] Delete succeeded, but sync failed for ${user.macAddress}: ${routerSyncWarning}`);
      }
    }
    res.status(200).json({
      message: 'User deleted successfully',
      routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // If a renewal comes in with a new expiry date, reset status to active
    if (req.body.paymentExpiryDate) {
      updateData.status = 'active';
    }
    
    const updatedUser = await WifiUser.findByIdAndUpdate(id, updateData, { new: true });
    let routerSyncWarning: string | null = null;

    if (updatedUser) {
      // Re-sync with router whenever status changes (Active/Expired)
      try {
        await RouterSync.syncUser(updatedUser);
        if (req.body.paymentExpiryDate) {
          console.log(`[Router] Access RE-ENABLED (Renewal) for MAC: ${updatedUser.macAddress} (User: ${updatedUser.name})`);
        }
      } catch (routerError: any) {
        routerSyncWarning = routerError?.message || 'Router sync failed after updating user.';
        console.error(`[Router] Update succeeded, but sync failed for ${updatedUser.macAddress}: ${routerSyncWarning}`);
      }
    }
    res.status(200).json(
      updatedUser
        ? {
            ...updatedUser.toObject(),
            routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true },
          }
        : updatedUser
    );
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
