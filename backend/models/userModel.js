import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String },
  profile: {
    address: { type: String, trim: true },
    profileImage: { type: String, trim: true }
  },

  // For email verification
  verifyOtp: { type: String },
  verifyOtpExpiry: { type: Number },
  isVerified: { type: Boolean, default: false },

  // For password reset
  resetOtp: { type: String },
  resetOtpExpiry: { type: Number },

  // OTP brute-force protection
  verifyOtpAttempts: { type: Number, default: 0 },
  resetOtpAttempts: { type: Number, default: 0 },
  otpLockoutUntil: { type: Date },

  // OAuth 2.0 Google Auth
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },

  // Admin Notes
  notes: { type: String, trim: true, default: '' },
},
{
  timestamps: true,
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;




