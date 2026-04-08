import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  amount: number;
  method: string;
  wifiUserId: mongoose.Types.ObjectId;
  wifiUserName: string;
  adminId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    wifiUserId: { 
      type: Schema.Types.ObjectId, 
      ref: 'WifiUser', 
      required: true 
    },
    wifiUserName: { type: String, required: true },
    adminId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
  },
  { 
    timestamps: true 
  }
);

// Index for reporting
PaymentSchema.index({ adminId: 1, createdAt: -1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
