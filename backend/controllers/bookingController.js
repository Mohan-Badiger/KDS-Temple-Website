import RazorpayService from "../services/razorpayService.js";
import mongoose from "mongoose";
import BookingModel from "../models/bookingModel.js";
import PoojaModel from "../models/poojaModel.js";
import sendBookingEmail from "../services/sendBookingEmail.js";
import verifyRazorpaySignature from '../utils/verifyPayment.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export const createBooking = async (req, res) => {
  try {
    const { 
      poojas, 
      totalAmount, 
      poojaInNameOf, 
      poojaDate, 
      templeId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature 
    } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID missing" });
    }

    if (!poojas || !Array.isArray(poojas) || poojas.length === 0) {
      return res.status(400).json({ success: false, message: "No poojas selected" });
    }

    if (!templeId) {
      return res.status(400).json({ success: false, message: "Temple ID is required" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment transaction details missing" });
    }

    // 1. Verify Razorpay Signature
    const isSignatureValid = verifyRazorpaySignature(razorpay_payment_id, razorpay_order_id, razorpay_signature);
    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 2. Fetch Razorpay Order and Verify Amount Matches
    const orderDetails = await RazorpayService.fetchOrder(razorpay_order_id);
    if (orderDetails.amount !== totalAmount * 100) {
      return res.status(400).json({ success: false, message: "Payment amount verification failed" });
    }

    // 3. Prevent duplicate bookings by paymentId
    const duplicateBooking = await BookingModel.findOne({ paymentId: razorpay_payment_id });
    if (duplicateBooking) {
      return res.status(400).json({ success: false, message: "This booking has already been recorded" });
    }

    // Check availability (Server-side validation)
    const [day, month, year] = poojaDate.split("-");
    const isoDateStr = `${year}-${month}-${day}`; // YYYY-MM-DD

    // Check Temple-wide restrictions (Festival/Closure)
    const temple = await mongoose.model("Temple").findById(templeId);
    if (temple?.unavailableDates?.includes(isoDateStr)) {
      return res.status(400).json({ 
        success: false, 
        message: `The ${temple.name} is closed on ${poojaDate} due to a festival or maintenance. Please select another date.` 
      });
    }

    // Check Service-specific restrictions
    const poojasData = await PoojaModel.find({ _id: { $in: poojas } });
    for (const pooja of poojasData) {
      const templeConfig = pooja.temples.find(t => (t.templeId?._id || t.templeId).toString() === templeId);
      if (templeConfig?.unavailableDates?.includes(isoDateStr)) {
        return res.status(400).json({ 
          success: false, 
          message: `The selected date (${poojaDate}) is restricted for ${pooja.name}. Please select another date.` 
        });
      }
    }

    const formattedDate = new Date(`${year}-${month}-${day}`);
    const escapedDevoteeName = escapeHtml(poojaInNameOf);

    const booking = new BookingModel({
      user: userId,
      temple: templeId,
      poojas,
      totalAmount,
      poojaInNameOf: escapedDevoteeName,
      poojaDate: formattedDate,
      status: "confirmed",
      receiptId: orderDetails.receipt,
      paymentId: razorpay_payment_id,
      paymentMethod: "Razorpay",
    });

    await booking.save();

    // Populate for email
    const populatedBooking = await BookingModel.findById(booking._id)
      .populate("user", "name email")
      .populate("temple", "name location")
      .populate("poojas", "name price");

    // Send confirmation email
    try {
      await sendBookingEmail({
        userEmail: populatedBooking.user.email,
        userName: populatedBooking.user.name,
        devoteeName: populatedBooking.poojaInNameOf,
        poojaDate,
        templeName: populatedBooking.temple.name,
        templeLocation: populatedBooking.temple.location,
        poojas: populatedBooking.poojas,
        totalAmount,
        paymentId: booking.paymentId,
        receiptId: booking.receiptId,
        bookingId: populatedBooking._id
      });
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ success: false, message: "Server error. Failed to confirm booking." });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await BookingModel.find({ user: userId })
      .populate("user", "name email phone")
      .populate("temple", "name location")
      .populate("poojas", "name price description")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Failed to retrieve bookings." });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find({})
      .populate("user", "name email")
      .populate("temple", "name location")
      .populate("poojas", "name price")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Failed to retrieve bookings." });
  }
};

export const getLatestBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await BookingModel.findOne({ user: userId })
      .populate("user", "name email phone")
      .populate("temple", "name location")
      .populate("poojas", "name price description")
      .sort({ createdAt: -1 });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Failed to retrieve latest booking." });
  }
};

export const getTodayBookings = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const bookings = await BookingModel.find({
      poojaDate: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ["confirmed", "approved", "completed"] },
    })
      .populate("user", "name email phone")
      .populate("temple", "name location")
      .populate("poojas", "name price")
      .sort({ createdAt: 1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Fetch Today Bookings Error:", error);
    res.status(500).json({ success: false, message: "Server error. Failed to retrieve today's bookings." });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "pending", "approved", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const booking = await BookingModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Status updated successfully", booking });
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    res.status(500).json({ success: false, message: "Server error. Failed to update status." });
  }
};