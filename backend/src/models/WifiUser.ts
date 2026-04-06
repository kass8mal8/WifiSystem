import mongoose, { Schema, Document } from 'mongoose';

export interface IWifiUser extends Document {
  name: string;
  macAddress: string;
  paymentExpiryDate: Date;
  amountPaid: number;
  methodPaid: string;
  status: 'active' | 'expired';
}

const WifiUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    macAddress: { type: String, required: true },
    paymentExpiryDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true },
    methodPaid: { type: String, required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model<IWifiUser>('WifiUser', WifiUserSchema);
