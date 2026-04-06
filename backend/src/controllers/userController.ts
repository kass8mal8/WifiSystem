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
    
    // Sync with Router — enable access for new user
    await RouterSync.syncUser(savedUser);
    
    console.log(`[Router] Access ENABLED for MAC: ${savedUser.macAddress} (User: ${savedUser.name})`);
    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await WifiUser.findByIdAndDelete(id);
    if (user) {
      // Disable the MAC rule on the router when a user is deleted
      await RouterSync.toggleMacRule(user.macAddress, user.name, false);
      console.log(`[Router] ACCESS REVOKED for MAC: ${user.macAddress} (User: ${user.name})`);
    }
    res.status(200).json({ message: 'User deleted successfully' });
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
    
    if (updatedUser) {
      // Re-sync with router whenever status changes (Active/Expired)
      await RouterSync.syncUser(updatedUser);
      
      if (req.body.paymentExpiryDate) {
        console.log(`[Router] Access RE-ENABLED (Renewal) for MAC: ${updatedUser.macAddress} (User: ${updatedUser.name})`);
      }
    }
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
