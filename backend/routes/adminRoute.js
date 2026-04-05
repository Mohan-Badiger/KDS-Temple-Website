import express from "express";
import { requestAdminOtp, verifyAdminOtp, getNotifications, clearNotification } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/request-otp", requestAdminOtp);
adminRouter.post("/verify-otp", verifyAdminOtp);
adminRouter.get("/get-notifications", adminAuth, getNotifications);
adminRouter.delete("/clear-notification/:id", adminAuth, clearNotification);

export default adminRouter;
