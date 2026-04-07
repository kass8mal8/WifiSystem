import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  routerUrl?: string;
  routerUsername?: string;
  routerPassword?: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    routerUrl: { type: String, default: 'http://192.168.1.1' },
    routerUsername: { type: String, default: 'admin' },
    routerPassword: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
