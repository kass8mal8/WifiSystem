import mongoose, { Schema, Document } from 'mongoose';

export interface IWifiUser extends Document {
  name: string;
  macAddress: string;
  paymentExpiryDate: Date;
  status: 'active' | 'expired';
  adminId: mongoose.Types.ObjectId; // Backlink to the Admin who owns this user
}

const WifiUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    macAddress: { type: String, required: true, uppercase: true, trim: true },
    paymentExpiryDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['active', 'expired'], 
      default: 'active' 
    },
    adminId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true // Indexed for fast lookups by admin
    },
  },
  { 
    timestamps: true 
  }
);

// Compound index to ensure uniqueness of MAC across a single admin's pool
WifiUserSchema.index({ macAddress: 1, adminId: 1 }, { unique: true });

export default mongoose.model<IWifiUser>('WifiUser', WifiUserSchema);
