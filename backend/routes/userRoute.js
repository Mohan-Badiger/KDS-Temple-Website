import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
import {
  requestRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
  adminLogin,
  requestResetOtp,
  verifyResetOtp,
  getProfile,
  updateProfile,
} from '../controllers/userController.js';

const router = express.Router();

// ===== User Registration & Verification =====
router.post('/request-register-otp', requestRegisterOtp);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/register', registerUser);

// ===== Login =====
router.post('/login', loginUser);
router.post('/admin', adminLogin);

// ===== Password Reset =====
router.post('/request-reset-otp', requestResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);

// ===== Profile =====
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, upload.single('profileImage'), updateProfile);

export default router;




