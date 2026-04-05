import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String },
  profile: {
    gothra: { type: String, trim: true },
    nakshatra: { type: String, trim: true },
    rashi: { type: String, trim: true },
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
  // Admin Notes
  notes: { type: String, trim: true, default: '' },
},
{
  timestamps: true,
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;




