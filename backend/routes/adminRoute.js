import express from "express";
import { requestAdminOtp, verifyAdminOtp } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/request-otp", requestAdminOtp);
adminRouter.post("/verify-otp", verifyAdminOtp);

export default adminRouter;
