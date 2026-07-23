import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
import {
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
} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// 1. Limiter for requesting OTPs (to protect mail servers from spam)
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: { success: false, message: 'Too many OTP requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Limiter for verification and login attempts (to protect against brute-force)
const authAttemptsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 attempts per windowMs
  message: { success: false, message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== User Registration & Verification =====
router.post('/request-register-otp', otpRequestLimiter, requestRegisterOtp);
router.post('/verify-register-otp', authAttemptsLimiter, verifyRegisterOtp);
router.post('/register', authAttemptsLimiter, registerUser);

// ===== Login & Google OAuth =====
router.post('/login', authAttemptsLimiter, loginUser);
router.post('/google-auth', authAttemptsLimiter, googleAuth);

// ===== Password Reset =====
router.post('/request-reset-otp', otpRequestLimiter, requestResetOtp);
router.post('/verify-reset-otp', authAttemptsLimiter, verifyResetOtp);

// ===== Profile =====
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, upload.single('profileImage'), updateProfile);

// ===== Admin User Management =====
router.get('/admin/all', adminAuth, getAllUsersAdmin);
router.get('/admin/details/:userId', adminAuth, getUserDetailsAdmin);
router.post('/admin/update-note', adminAuth, updateUserNote);
router.get('/admin/stats', adminAuth, getUserStats);

export default router;




