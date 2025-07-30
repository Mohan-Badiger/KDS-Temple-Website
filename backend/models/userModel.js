// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     resetOtp: { type: String },          // OTP for reset password
//     resetOtpExpiry: { type: Date },      // OTP expiry time
// });

// // Prevent model overwrite on hot reloads in dev
// const userModel = mongoose.models.user || mongoose.model('user', userSchema);

// export default userModel;

//===================================================================================================================

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },

//   // For email verification
//   verifyOtp: { type: String },
//   verifyOtpExpiry: { type: Number },
//   isVerified: { type: Boolean, default: false },

//   // For password reset
//   resetOtp: { type: String },
//   resetOtpExpiry: { type: Date },
// });

// const userModel = mongoose.models.user || mongoose.model("user", userSchema);
// export default userModel;


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




