import express from "express";
import {
  createBooking,
  approveBooking,
  getUserBookings,
  getAllBookings,
  getLatestBooking,
  getPoojaRequests, // import the function to get pending pooja requests
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.put("/approve/:bookingId", approveBooking);
router.get("/user/:userId", getUserBookings);
router.get("/all", getAllBookings);
router.get("/latest", getLatestBooking);

// New route for fetching pending pooja requests
router.get("/pooja-requests", getPoojaRequests);

export default router;
