import express from 'express';
import {
  requestRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
  adminLogin,
  requestResetOtp,
  verifyResetOtp,
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

export default router;




