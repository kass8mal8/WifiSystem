import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wifi_manager';

async function seedAdmin() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists. Skipping...');
    } else {
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const admin = new User({
        username: 'admin',
        password: adminPassword,
      });
      await admin.save();
      console.log('Default admin user created successfully!');
      console.log('Username: admin');
      console.log(`Password: ${adminPassword}`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
