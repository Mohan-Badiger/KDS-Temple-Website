// import express from 'express'
// import { loginUser, registerUser, adminLogin } from '../controllers/userController.js'

// const userRouter = express.Router();

// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);
// userRouter.post('/admin', adminLogin);

// export default userRouter;

import express from 'express'
import {
    loginUser,
    registerUser,
    adminLogin,
    requestResetOtp,
    verifyResetOtp,
} from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Forgot Password OTP Routes
userRouter.post('/request-reset-otp', requestResetOtp);
userRouter.post('/verify-reset-otp', verifyResetOtp);

export default userRouter;
