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

app.use(cors());
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
    
    // Socket.io connection handler
    io.on('connection', (socket) => {
      console.log('Admin connected:', socket.id);
      socket.on('disconnect', () => console.log('Admin disconnected'));
    });

    // Start background real-time router polling
    startRouterPolling(io);

    httpServer.listen(PORT, () => {
      console.log(`Server is running with WebSockets on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

export { io };
