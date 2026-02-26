import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },

  // For email verification
  verifyOtp: { type: String },
  verifyOtpExpiry: { type: Number },
  isVerified: { type: Boolean, default: false },

  // For password reset
  resetOtp: { type: String },
  resetOtpExpiry: { type: Number },
},
{
  timestamps: true,
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;




