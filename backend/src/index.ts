import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import routerRoutes from './routes/routerRoutes';
import { authenticate } from './middleware/auth';
import jwt from 'jsonwebtoken';
import { startExpiryJob } from './cron/expiryJob';
import { startRouterPolling } from './utils/routerEmitter';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, replace with your frontend URL
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:3000',
    'https://smartwifimanager.netlify.app', 
    'https://wifisystem.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Attach io to request for use in controllers if needed
app.use((req, res, next) => {
  (req as any).io = io;
  next();
});

app.use('/api/users', authenticate, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/router', authenticate, routerRoutes);

const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wifi_manager';

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    startExpiryJob();
    
    // Socket.io authentication middleware
    io.use((socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
        (socket as any).user = decoded;
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid token'));
      }
    });

    // Socket.io connection handler
    io.on('connection', (socket) => {
      const userId = (socket as any).user?.id;
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket] User ${userId} connected and joined room user:${userId}`);
      }
      
      socket.on('disconnect', () => {
        console.log(`[Socket] User ${userId || socket.id} disconnected`);
      });
    });

    // Start background real-time router polling (only when running on the local network)
    if (process.env.ENABLE_ROUTER_POLLING === 'true') {
      console.log('[RouterEmitter] ENABLE_ROUTER_POLLING=true — starting local router polling...');
      startRouterPolling(io);
    } else {
      console.log('[RouterEmitter] Router polling disabled (set ENABLE_ROUTER_POLLING=true to enable).');
    }

    httpServer.listen(PORT, () => {
      console.log(`Server is running with WebSockets on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

export { io };
