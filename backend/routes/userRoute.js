import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
import {
  requestRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
  requestResetOtp,
  verifyResetOtp,
  getProfile,
  updateProfile,
  getAllUsersAdmin,
  getUserDetailsAdmin,
  addUserManual,
  updateUserNote,
  getUserStats
} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// ===== User Registration & Verification =====
router.post('/request-register-otp', requestRegisterOtp);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/register', registerUser);

// ===== Login =====
router.post('/login', loginUser);

// ===== Password Reset =====
router.post('/request-reset-otp', requestResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);

// ===== Profile =====
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, upload.single('profileImage'), updateProfile);

// ===== Admin User Management =====
router.get('/admin/all', adminAuth, getAllUsersAdmin);
router.get('/admin/details/:userId', adminAuth, getUserDetailsAdmin);
router.post('/admin/add', adminAuth, addUserManual);
router.post('/admin/update-note', adminAuth, updateUserNote);
router.get('/admin/stats', adminAuth, getUserStats);

export default router;




