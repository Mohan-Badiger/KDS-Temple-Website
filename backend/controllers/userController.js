import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import sendOtpEmail from '../services/sendOtpEmail.js';
import cloudinary from '../config/cloudinary.js';
import BookingModel from '../models/bookingModel.js';
import DonationModel from '../models/donationModel.js';

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
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
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
// 8. Get User Profile
// ===============================
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password -verifyOtp -verifyOtpExpiry -resetOtp -resetOtpExpiry');
    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// 9. Update User Profile
// ===============================
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, gothra, nakshatra, rashi, address } = req.body;
    
    // Check if email is being updated and if it's already taken by someone else
    if (email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id.toString()) {
        return res.json({ success: false, message: 'Email is already taken by another account' });
      }
    }

    const updatedData = { name, phone };
    if (email) updatedData.email = email;
    
    // Fetch user to preserve existing profile elements
    const user = await userModel.findById(req.user.id);
    if (!user) return res.json({ success: false, message: 'User not found' });

    let profileImageUrl = user.profile?.profileImage || '';

    // Handle new image upload via stream
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'user_profiles' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();
      profileImageUrl = result.secure_url;
    }

    updatedData.profile = {
      gothra: gothra !== undefined ? gothra : (user.profile?.gothra || ''),
      nakshatra: nakshatra !== undefined ? nakshatra : (user.profile?.nakshatra || ''),
      rashi: rashi !== undefined ? rashi : (user.profile?.rashi || ''),
      address: address !== undefined ? address : (user.profile?.address || ''),
      profileImage: profileImageUrl
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updatedData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// 10. Admin: Get All Users with stats
// ===============================
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password').sort({ createdAt: -1 });
    
    const userStats = await Promise.all(users.map(async (user) => {
      const bookings = await BookingModel.find({ user: user._id });
      const donations = await DonationModel.find({ 
        $or: [{ email: user.email }, { phone: user.phone }] 
      });

      const totalBookingsAmount = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
      const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);

      return {
        ...user._doc,
        totalBookings: bookings.length,
        totalDonations: donations.length,
        totalAmount: totalBookingsAmount + totalDonationsAmount
      };
    }));

    res.json({ success: true, users: userStats });
  } catch (error) {
    console.error('GetAllUsersAdmin Error:', error);
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// 11. Admin: Get User Details with History
// ===============================
const getUserDetailsAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).select('-password');
    if (!user) return res.json({ success: false, message: 'User not found' });

    const bookings = await BookingModel.find({ user: userId }).populate('temple poojas');
    const donations = await DonationModel.find({ 
      $or: [{ email: user.email }, { phone: user.phone }] 
    }).populate('temple');

    res.json({ 
      success: true, 
      user, 
      history: { 
        bookings, 
        donations 
      } 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// 12. Admin: Add User Manually
// ===============================
const addUserManual = async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;

    if (!email) return res.json({ success: false, message: 'Email is required' });

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.json({ success: false, message: 'User with this email already exists' });

    const newUser = new userModel({
      name,
      email,
      phone,
      notes,
      isVerified: true // Admin added users are pre-verified
    });

    await newUser.save();
    res.json({ success: true, message: 'User added successfully', user: newUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// 13. Admin: Update User Note
// ===============================
const updateUserNote = async (req, res) => {
  try {
    const { userId, notes } = req.body;
    await userModel.findByIdAndUpdate(userId, { notes });
    res.json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// 14. Admin: Get User Stats for Dashboard
// ===============================
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newUsersMonth = await userModel.countDocuments({ createdAt: { $gte: startOfMonth } });

    // For total amount, we need to sum all bookings and donations
    const allBookings = await BookingModel.find({});
    const allDonations = await DonationModel.find({});

    const totalAmount = allBookings.reduce((sum, b) => sum + b.totalAmount, 0) + 
                        allDonations.reduce((sum, d) => sum + d.amount, 0);

    res.json({ 
      success: true, 
      stats: { 
        totalUsers, 
        newUsersMonth, 
        totalAmount 
      } 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
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
  getProfile,
  updateProfile,
  getAllUsersAdmin,
  getUserDetailsAdmin,
  addUserManual,
  updateUserNote,
  getUserStats
};
