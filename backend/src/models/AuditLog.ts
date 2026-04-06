import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  target: string;
  performedBy: string;
  details: string;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    target: { type: String, required: true },
    performedBy: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
