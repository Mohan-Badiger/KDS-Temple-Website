import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  otpHash: { type: String },
  otpExpiry: { type: Date },
  lastLogin: { type: Date },
  otpRequestCount: { type: Number, default: 0 },
  lastOtpRequest: { type: Date }
}, {
  timestamps: true,
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
