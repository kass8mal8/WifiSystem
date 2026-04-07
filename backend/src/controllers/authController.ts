import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        routerUrl: user.routerUrl,
        routerUsername: user.routerUsername
      } 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, routerUrl, routerUsername, routerPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      routerUrl: routerUrl || 'http://192.168.1.1',
      routerUsername: routerUsername || 'admin',
      routerPassword: routerPassword || ''
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        routerUrl: user.routerUrl,
        routerUsername: user.routerUsername
      } 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRouterSettings = async (req: any, res: Response) => {
  const { routerUrl, routerUsername, routerPassword } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (routerUrl) user.routerUrl = routerUrl;
    if (routerUsername) user.routerUsername = routerUsername;
    if (routerPassword) user.routerPassword = routerPassword;

    await user.save();

    res.json({
      message: 'Router settings updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        routerUrl: user.routerUrl,
        routerUsername: user.routerUsername
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
