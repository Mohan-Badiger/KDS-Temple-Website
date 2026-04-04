import express from "express";
import {
  createBooking,
  approveBooking,
  getUserBookings,
  getAllBookings,
  getMyBookings,
  getLatestBooking,
  getPoojaRequests, // import the function to get pending pooja requests
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createBooking);
router.put("/approve/:bookingId", approveBooking);
router.get("/user/:userId", getUserBookings);
router.get("/all", getAllBookings);
router.get("/latest", authMiddleware, getLatestBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);

// New route for fetching pending pooja requests
router.get("/pooja-requests", getPoojaRequests);

export default router;
