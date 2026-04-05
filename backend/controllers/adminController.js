import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import sendOtpEmail from "../services/sendOtpEmail.js";

// ===============================
// 1. Request OTP for Admin Login
// ===============================
const requestAdminOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email address" });
    }

    // Only allow specific admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Unauthorized access attempt" });
    }

    let admin = await adminModel.findOne({ email });

    if (!admin) {
      admin = new adminModel({ email });
    }

    // Rate limiting: max 3 requests per 5 minutes
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    if (admin.lastOtpRequest && admin.lastOtpRequest > fiveMinutesAgo) {
      if (admin.otpRequestCount >= 3) {
        return res.json({
          success: false,
          message: "Too many OTP requests. Please try again after 5 minutes.",
        });
      }
      admin.otpRequestCount += 1;
    } else {
      admin.otpRequestCount = 1;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = now + 10 * 60 * 1000; // 10 minutes

    admin.otpHash = otpHash;
    admin.otpExpiry = otpExpiry;
    admin.lastOtpRequest = now;

    await admin.save();
    await sendOtpEmail(email, otp, "Admin Login OTP", "Admin Panel Login");

    return res.json({ success: true, message: "OTP sent to your admin email" });
  } catch (err) {
    console.error("Admin OTP Error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// ===============================
// 2. Verify OTP for Admin Login
// ===============================
const verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP are required" });
    }

    const admin = await adminModel.findOne({ email });

    if (!admin || !admin.otpHash) {
      return res.json({ success: false, message: "OTP not requested. Please try again." });
    }

    // Check expiry
    if (Date.now() > admin.otpExpiry) {
      admin.otpHash = null;
      admin.otpExpiry = null;
      await admin.save();
      return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, admin.otpHash);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Success: Clear OTP and generate token
    admin.otpHash = null;
    admin.otpExpiry = null;
    admin.lastLogin = Date.now();
    admin.otpRequestCount = 0; // Reset rate limit on success
    await admin.save();

    // Payload includes email and role for the new middleware
    const token = jwt.sign(
      { email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // 1 day session
    );

    return res.json({ success: true, token, message: "Login successful" });
  } catch (err) {
    console.error("Admin Verify Error:", err);
    return res.json({ success: false, message: err.message });
  }
};

export { requestAdminOtp, verifyAdminOtp };
