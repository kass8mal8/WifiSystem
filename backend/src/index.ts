import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import routerRoutes from './routes/routerRoutes';
import { authenticate } from './middleware/auth';
import { startExpiryJob } from './cron/expiryJob';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', authenticate, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/router', authenticate, routerRoutes);

const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wifi_manager';

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    startExpiryJob();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
