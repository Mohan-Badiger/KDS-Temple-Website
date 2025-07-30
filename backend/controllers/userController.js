// import userModel from '../models/userModel.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import validator from 'validator';
// import sendOtpEmail from '../services/sendOtpEmail.js';

// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// // Route: Login User
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "User doesn't exist" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       const token = createToken(user._id);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Route: Register User
// // const registerUser = async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;

// //     // Check if user already exists
// //     const exists = await userModel.findOne({ email });
// //     if (exists) {
// //       return res.json({ success: false, message: "User already exists" });
// //     }

// //     // Validate email and password
// //     if (!validator.isEmail(email)) {
// //       return res.json({ success: false, message: "Please enter valid email" });
// //     }
// //     if (password.length < 6) {
// //       return res.json({ success: false, message: "Password must be at least 6 characters" });
// //     }

// //     // Hash password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     // Create user
// //     const newUser = new userModel({ name, email, password: hashedPassword });
// //     const user = await newUser.save();

// //     const token = createToken(user._id);
// //     res.json({ success: true, token });
// //   } catch (error) {
// //     console.error(error);
// //     res.json({ success: false, message: error.message });
// //   }
// // };

// //--------------------------------------------------------------------------------------------------------------------------

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existing = await userModel.findOne({ email });

//     if (existing && existing.isVerified) {
//       return res.json({ success: false, message: "User already exists and is verified." });
//     }

//     if (!validator.isEmail(email)) {
//       return res.json({ success: false, message: "Invalid email" });
//     }
//     if (password.length < 6) {
//       return res.json({ success: false, message: "Password must be at least 6 characters" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//     if (existing) {
//       existing.name = name;
//       existing.password = hashedPassword;
//       existing.verifyOtp = otp;
//       existing.verifyOtpExpiry = otpExpiry;
//       await existing.save();
//     } else {
//       const newUser = new userModel({
//         name,
//         email,
//         password: hashedPassword,
//         verifyOtp: otp,
//         verifyOtpExpiry: otpExpiry,
//         isVerified: false,
//       });
//       await newUser.save();
//     }

//     await sendOtpEmail(email, otp);
//     res.json({ success: true, message: "OTP sent to your email for verification." });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };


// // Verify Registration OTP
// // ===================
// const verifyRegistrationOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await userModel.findOne({ email });
//     if (!user) return res.json({ success: false, message: "User not found" });

//     if (!user.verifyOtp || !user.verifyOtpExpiry) {
//       return res.json({ success: false, message: "OTP not requested" });
//     }

//     if (user.verifyOtp !== otp) {
//       return res.json({ success: false, message: "Invalid OTP" });
//     }

//     if (Date.now() > user.verifyOtpExpiry) {
//       user.verifyOtp = null;
//       user.verifyOtpExpiry = null;
//       await user.save();
//       return res.json({ success: false, message: "OTP expired. Please register again." });
//     }

//     user.isVerified = true;
//     user.verifyOtp = null;
//     user.verifyOtpExpiry = null;
//     await user.save();

//     const token = createToken(user._id);
//     res.json({ success: true, token, message: "Email verified successfully" });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };


// //--------------------------------------------------------------------------------------------------------------------------

// // Route: Admin Login
// const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//       const token = jwt.sign(email + password, process.env.JWT_SECRET);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Route: Request Reset OTP
// const requestResetOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.json({ success: false, message: "Email is required" });

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "Email not found" });
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Set OTP expiry to 10 minutes from now
//     const otpExpiry = Date.now() + 10 * 60 * 1000;

//     // Save OTP and expiry to user document
//     user.resetOtp = otp;
//     user.resetOtpExpiry = otpExpiry;
//     await user.save();

//     await sendOtpEmail(email, otp);
//     res.json({ success: true, message: "OTP sent to your email" });
    
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Route: Verify OTP and Reset Password
// const verifyResetOtp = async (req, res) => {
//   try {
//     const { email, otp, password } = req.body;

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "Invalid email or OTP" });
//     }

//     if (!user.resetOtp || !user.resetOtpExpiry) {
//       return res.json({ success: false, message: "No OTP requested. Please request OTP first." });
//     }

//     // Check OTP and expiry
//     if (user.resetOtp !== otp) {
//       return res.json({ success: false, message: "Invalid OTP" });
//     }
//     if (user.resetOtpExpiry < Date.now()) {
//       return res.json({ success: false, message: "OTP expired" });
//     }

//     // Validate password length
//     if (password.length < 6) {
//       return res.json({ success: false, message: "Password must be at least 6 characters" });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Clear OTP fields
//     user.resetOtp = null;
//     user.resetOtpExpiry = null;

//     await user.save();

//     res.json({ success: true, message: "Password updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export {
//   loginUser,
//   registerUser,
//   verifyRegistrationOtp,
//   adminLogin,
//   requestResetOtp,
//   verifyResetOtp,
// };


///=====================================================================================================
///=====================================================================================================
///=====================================================================================================

import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import sendOtpEmail from '../services/sendOtpEmail.js';

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ===============================
// 1. Request OTP for Registration
// ===============================
const requestRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email address' });
    }

    let user = await userModel.findOne({ email });

    if (user && user.isVerified && user.password) {
      return res.json({ success: false, message: 'User already exists and is registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    if (!user) {
      user = new userModel({
        email,
        verifyOtp: otp,
        verifyOtpExpiry: otpExpiry,
        isVerified: false,
      });
    } else {
      user.verifyOtp = otp;
      user.verifyOtpExpiry = otpExpiry;
      user.isVerified = false;
    }

    await user.save();
    await sendOtpEmail(email, otp);

    return res.json({ success: true, message: 'OTP sent to your email for verification' });
  } catch (err) {
    console.error('OTP Error:', err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// 2. Verify OTP for Email
// ===============================
const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !user.verifyOtp || !user.verifyOtpExpiry) {
      return res.json({ success: false, message: 'OTP not requested or user not found' });
    }

    if (user.verifyOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (Date.now() > user.verifyOtpExpiry) {
      user.verifyOtp = null;
      user.verifyOtpExpiry = null;
      await user.save();
      return res.json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpiry = null;
    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// 3. Register User (after OTP verified)
// ===============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Name, email, and password are required' });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Please verify your email first' });
    }

    if (!user.isVerified) {
      return res.json({ success: false, message: 'Email not verified' });
    }

    if (user.password) {
      return res.json({ success: false, message: 'User already registered' });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.password = hashedPassword;
    await user.save();

    const token = createToken(user._id);
    return res.json({ success: true, token, message: 'Account created successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// 4. Login User
// ===============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    if (!user.isVerified || !user.password) {
      return res.json({ success: false, message: "Please complete email verification and account setup" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    return res.json({ success: true, token });
  } catch (err) {
    console.error('Login Error:', err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// 5. Admin Login
// ===============================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ success: true, token });
    }

    return res.json({ success: false, message: 'Invalid admin credentials' });
  } catch (err) {
    console.error('Admin Login Error:', err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// 6. Request OTP for Password Reset
// ===============================
const requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: 'Email not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail(email, otp);
    return res.json({ success: true, message: 'Reset OTP sent to your email' });
  } catch (err) {
    console.error('Reset OTP Error:', err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// 7. Verify OTP & Reset Password
// ===============================
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || user.resetOtp !== otp || Date.now() > user.resetOtpExpiry) {
      return res.json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: 'Password too short' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset Error:', err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// Export All Controllers
// ===============================
export {
  requestRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
  adminLogin,
  requestResetOtp,
  verifyResetOtp,
};
