// import express from 'express'
// import {
//     loginUser,
//     registerUser,
//     adminLogin,
//     requestResetOtp,
//     verifyResetOtp,
// } from '../controllers/userController.js'

// const userRouter = express.Router();

// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);
// userRouter.post('/admin', adminLogin);

// // Forgot Password OTP Routes
// userRouter.post('/request-reset-otp', requestResetOtp);
// userRouter.post('/verify-reset-otp', verifyResetOtp);

// export default userRouter;

//==========================================================================================================

// import express from 'express';
// import {
//   requestRegisterOtp,
//   verifyRegisterOtp,
//   registerUser,
//   loginUser,
//   requestResetOtp,
//   verifyResetOtp,
// } from '../controllers/userController.js';

// const router = express.Router();

// router.post('/request-register-otp', requestRegisterOtp);
// router.post('/verify-register-otp', verifyRegisterOtp);
// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/request-reset-otp', requestResetOtp);
// router.post('/verify-reset-otp', verifyResetOtp);

// export default router;


import express from 'express';
import {
  requestRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
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

// ===== Password Reset =====
router.post('/request-reset-otp', requestResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);

export default router;




