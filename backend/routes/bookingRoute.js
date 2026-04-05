import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getLatestBooking,
  getTodayBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", authMiddleware, createBooking);
router.get("/all", getAllBookings);
router.get("/latest", authMiddleware, getLatestBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.get("/today", adminAuth, getTodayBookings);
router.patch("/status/:id", adminAuth, updateBookingStatus);

export default router;
