import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { OAuth2Client } from 'google-auth-library';
import sendOtpEmail from '../services/sendOtpEmail.js';
import sendWelcomeEmail from '../services/sendWelcomeEmail.js';
import BookingModel from '../models/bookingModel.js';
import DonationModel from '../models/donationModel.js';
import cloudinary from '../config/cloudinary.js';

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' });

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
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    if (!user) {
      user = new userModel({
        email,
        verifyOtp: otpHash,
        verifyOtpExpiry: otpExpiry,
        verifyOtpAttempts: 0,
        isVerified: false,
      });
    } else {
      user.verifyOtp = otpHash;
      user.verifyOtpExpiry = otpExpiry;
      user.verifyOtpAttempts = 0;
      user.otpLockoutUntil = null;
      user.isVerified = false;
    }

    await user.save();
    await sendOtpEmail(email, otp);

    return res.json({ success: true, message: 'OTP sent to your email for verification' });
  } catch (err) {
    console.error('OTP Error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
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

    // Check brute force lockout
    if (user.otpLockoutUntil && user.otpLockoutUntil > Date.now()) {
      const timeLeft = Math.ceil((user.otpLockoutUntil - Date.now()) / (60 * 1000));
      return res.json({ success: false, message: `Too many failed attempts. Try again in ${timeLeft} minutes.` });
    }

    // Verify OTP matching
    const isMatch = await bcrypt.compare(otp, user.verifyOtp);
    if (!isMatch) {
      user.verifyOtpAttempts = (user.verifyOtpAttempts || 0) + 1;
      if (user.verifyOtpAttempts >= 5) {
        user.otpLockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
        user.verifyOtpAttempts = 0; // Reset counter for next cycle
      }
      await user.save();

      const msg = user.otpLockoutUntil
        ? 'Too many failed attempts. Verification locked for 15 minutes.'
        : `Invalid OTP. ${5 - user.verifyOtpAttempts} attempts remaining.`;
      return res.json({ success: false, message: msg });
    }

    // Check expiry
    if (Date.now() > user.verifyOtpExpiry) {
      user.verifyOtp = null;
      user.verifyOtpExpiry = null;
      user.verifyOtpAttempts = 0;
      await user.save();
      return res.json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpiry = null;
    user.verifyOtpAttempts = 0;
    user.otpLockoutUntil = null;
    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
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

    // Trigger welcome email asynchronously
    sendWelcomeEmail(email, name).catch((err) => {
      console.error('Welcome email error:', err);
    });

    const token = createToken(user._id);
    return res.json({ success: true, token, message: 'Account created successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
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
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
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
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.resetOtp = otpHash;
    user.resetOtpExpiry = otpExpiry;
    user.resetOtpAttempts = 0;
    user.otpLockoutUntil = null;
    await user.save();

    await sendOtpEmail(email, otp);
    return res.json({ success: true, message: 'Reset OTP sent to your email' });
  } catch (err) {
    console.error('Reset OTP Error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ===============================
// 7. Verify OTP & Reset Password
// ===============================
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return res.json({ success: false, message: 'Reset OTP not requested or user not found' });
    }

    // Check brute force lockout
    if (user.otpLockoutUntil && user.otpLockoutUntil > Date.now()) {
      const timeLeft = Math.ceil((user.otpLockoutUntil - Date.now()) / (60 * 1000));
      return res.json({ success: false, message: `Too many failed attempts. Try again in ${timeLeft} minutes.` });
    }

    // Match reset OTP
    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) {
      user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
      if (user.resetOtpAttempts >= 5) {
        user.otpLockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins lockout
        user.resetOtpAttempts = 0;
      }
      await user.save();

      const msg = user.otpLockoutUntil
        ? 'Too many failed attempts. Verification locked for 15 minutes.'
        : `Invalid OTP. ${5 - user.resetOtpAttempts} attempts remaining.`;
      return res.json({ success: false, message: msg });
    }

    // Check expiry
    if (Date.now() > user.resetOtpExpiry) {
      user.resetOtp = null;
      user.resetOtpExpiry = null;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: 'Password too short' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.resetOtpAttempts = 0;
    user.otpLockoutUntil = null;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset Error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ===============================
// 8. Get User Profile
// ===============================
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password -verifyOtp -verifyOtpExpiry -resetOtp -resetOtpExpiry -verifyOtpAttempts -resetOtpAttempts -otpLockoutUntil');
    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Failed to retrieve profile.' });
  }
};

// ===============================
// 9. Update User Profile
// ===============================
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, profileImage } = req.body;
    
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

    let profileImageUrl = profileImage || user.profile?.profileImage || '';

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
      address: address !== undefined ? address : (user.profile?.address || ''),
      profileImage: profileImageUrl
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updatedData,
      { new: true, runValidators: true }
    ).select('-password -verifyOtp -verifyOtpExpiry -resetOtp -resetOtpExpiry -verifyOtpAttempts -resetOtpAttempts -otpLockoutUntil');

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Failed to update profile.' });
  }
};

// ===============================
// 10. Admin: Get All Users with stats
// ===============================
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password').sort({ createdAt: -1 });
    
    const userIds = users.map(u => u._id);
    const emails = users.map(u => u.email).filter(Boolean);
    const phones = users.map(u => u.phone).filter(Boolean);

    const bookings = await BookingModel.find({ user: { $in: userIds } });
    const donations = await DonationModel.find({ 
      $or: [
        { email: { $in: emails } },
        { phone: { $in: phones } }
      ] 
    });

    const bookingsByUser = {};
    bookings.forEach(b => {
      const uid = b.user.toString();
      if (!bookingsByUser[uid]) bookingsByUser[uid] = [];
      bookingsByUser[uid].push(b);
    });

    const userStats = users.map((user) => {
      const uid = user._id.toString();
      const userBookings = bookingsByUser[uid] || [];
      
      const userDonations = donations.filter(d => 
        (d.email && d.email.toLowerCase() === user.email?.toLowerCase()) || 
        (d.phone && d.phone === user.phone)
      );

      const totalBookingsAmount = userBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      const totalDonationsAmount = userDonations.reduce((sum, d) => sum + d.amount, 0);

      return {
        ...user._doc,
        totalBookings: userBookings.length,
        totalDonations: userDonations.length,
        totalAmount: totalBookingsAmount + totalDonationsAmount
      };
    });

    res.json({ success: true, users: userStats });
  } catch (error) {
    console.error('GetAllUsersAdmin Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Failed to fetch user records.' });
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
    res.status(500).json({ success: false, message: 'Server error. Failed to fetch user details.' });
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
    res.status(500).json({ success: false, message: 'Server error. Failed to update user note.' });
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
    res.status(500).json({ success: false, message: 'Server error. Failed to retrieve dashboard stats.' });
  }
};

// ===============================
// 13. Google OAuth 2.0 Authentication
// ===============================
const googleAuth = async (req, res) => {
  try {
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
      return res.json({ success: false, message: 'Google authentication token is required' });
    }

    let email, name, picture, googleId;

    if (credential) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'your_google_client_id_here.apps.googleusercontent.com') {
        return res.json({
          success: false,
          message: 'Google Client ID is not configured on the server. Please set GOOGLE_CLIENT_ID in backend/.env'
        });
      }

      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.json({ success: false, message: 'Invalid Google token payload' });
      }

      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (accessToken) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        return res.json({ success: false, message: 'Failed to verify Google access token' });
      }

      const userInfo = await response.json();
      googleId = userInfo.sub;
      email = userInfo.email;
      name = userInfo.name;
      picture = userInfo.picture;
    }

    if (!email) {
      return res.json({ success: false, message: 'Google account does not contain a valid email' });
    }

    // Search for existing user by googleId or email
    let user = await userModel.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }]
    });

    let isNewUser = false;

    if (user) {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.authProvider || 'google';
        updated = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        updated = true;
      }
      if (picture && (!user.profile || !user.profile.profileImage || user.authProvider === 'google')) {
        user.profile = user.profile || {};
        user.profile.profileImage = picture;
        updated = true;
      }
      if (name && !user.name) {
        user.name = name;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    } else {
      isNewUser = true;
      user = new userModel({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        authProvider: 'google',
        isVerified: true,
        profile: {
          profileImage: picture || ''
        }
      });
      await user.save();

      // Send welcome email asynchronously
      sendWelcomeEmail(user.email, user.name).catch((err) => {
        console.error('Welcome email error (Google Auth):', err);
      });
    }

    const token = createToken(user._id);
    return res.json({
      success: true,
      token,
      isNewUser,
      message: 'Google authentication successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        profile: {
          address: user.profile?.address || '',
          profileImage: user.profile?.profileImage || ''
        }
      }
    });

  } catch (err) {
    console.error('Google Auth Error:', err);
    return res.status(500).json({ success: false, message: 'Google Authentication failed. Please try again.' });
  }
};

export {
  requestRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
  googleAuth,
  requestResetOtp,
  verifyResetOtp,
  getProfile,
  updateProfile,
  getAllUsersAdmin,
  getUserDetailsAdmin,
  updateUserNote,
  getUserStats
};

