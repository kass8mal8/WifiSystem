import mongoose from 'mongoose';
import { Request, Response } from 'express';
import WifiUser from '../models/WifiUser';
import AuditLog from '../models/AuditLog';
import User from '../models/User';
import Payment from '../models/Payment';
import { RouterSync, RouterConfig } from '../utils/routerSync';

const getRouterConfig = (admin: any): RouterConfig => ({
  routerUrl: admin.routerUrl || process.env.ROUTER_URL || 'http://192.168.1.1',
  routerUsername: admin.routerUsername || process.env.ROUTER_USERNAME || 'admin',
  routerPasswordRaw: admin.routerPassword || process.env.ROUTER_PASSWORD || '',
});

export const getUsers = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    // Use aggregation to join payments and calculate total amountPaid
    const users = await WifiUser.aggregate([
      { $match: { adminId: new mongoose.Types.ObjectId(adminId) } },
      {
        $lookup: {
          from: 'payments', // Note: MongoDB collection names are usually plural/lowercase
          localField: '_id',
          foreignField: 'wifiUserId',
          as: 'payments'
        }
      },
      {
        $addFields: {
          amountPaid: { $sum: '$payments.amount' }
        }
      },
      {
        $project: {
          payments: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
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

    // Audit Log & Payment tracking
    try {
      await AuditLog.create({
        action: 'CREATE_USER',
        target: `${savedUser.name} (${savedUser.macAddress})`,
        performedBy: admin.name || admin.email,
        details: `Initial payment: ${req.body.amountPaid} via ${req.body.methodPaid || 'Unknown'}`,
      });

      // Record the initial payment
      if (req.body.amountPaid) {
        await Payment.create({
          amount: parseFloat(req.body.amountPaid),
          method: req.body.methodPaid || 'Unknown',
          wifiUserId: savedUser._id,
          wifiUserName: savedUser.name,
          adminId
        });
      }
    } catch (logError) {
      console.error('[AuditLog/Payment Error]', logError);
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

export const revokeUser = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Mark as expired in DB
    const user = await WifiUser.findOneAndUpdate(
      { _id: id, adminId }, 
      { $set: { status: 'expired' } },
      { returnDocument: 'after' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found or unauthorized' });
    }

    // Audit Log
    try {
      await AuditLog.create({
        action: 'REVOKE_ACCESS',
        target: `${user.name} (${user.macAddress})`,
        performedBy: admin.name || admin.email,
        details: 'Manual access revocation',
      });
    } catch (logError) {
      console.error('[AuditLog Error]', logError);
    }

    let routerSyncWarning: string | null = null;
    try {
      const config = getRouterConfig(admin);
      await RouterSync.toggleMacRule(config, user.macAddress, user.name, false);
      console.log(`[Router] Successfully revoked access for ${user.macAddress}`);
    } catch (routerError: any) {
      routerSyncWarning = routerError?.message || 'Router sync failed while revoking access.';
      console.error(`[Router] DB updated to expired, but sync failed for ${user.macAddress}: ${routerSyncWarning}`);
    }

    res.status(200).json({
      ...user.toObject(),
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
    
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const { amountPaid, methodPaid, ...rest } = req.body;
    const updateQuery: any = { $set: { ...rest } };

    if (req.body.paymentExpiryDate) {
      updateQuery.$set.status = 'active';
    }
    
    // Ensure ownership during update
    const updatedUser = await WifiUser.findOneAndUpdate(
      { _id: id, adminId }, 
      updateQuery, 
      { returnDocument: 'after' }
    );

    let routerSyncWarning: string | null = null;

    if (updatedUser) {
      // Create Payment Record if amount was paid
      if (amountPaid) {
        try {
          await Payment.create({
            amount: Number(amountPaid),
            method: methodPaid || 'Unknown',
            wifiUserId: updatedUser._id,
            wifiUserName: updatedUser.name,
            adminId
          });
        } catch (payError) {
          console.error('[Payment Error]', payError);
        }
      }

      // Audit Log
      try {
        await AuditLog.create({
          action: req.body.paymentExpiryDate ? 'RENEW_SUBSCRIPTION' : 'UPDATE_USER',
          target: `${updatedUser.name} (${updatedUser.macAddress})`,
          performedBy: admin.name || admin.email,
          details: req.body.paymentExpiryDate 
            ? `Renewed until ${new Date(req.body.paymentExpiryDate).toLocaleDateString()}. Amount: ${amountPaid}` 
            : 'User details updated',
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

export const getPayments = async (req: any, res: Response) => {
  try {
    const adminId = req.user.id;
    const payments = await Payment.find({ adminId }).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
