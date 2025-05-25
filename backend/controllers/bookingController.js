import RazorpayService from "../services/razorpayService.js"
import mongoose from "mongoose";
import BookingModel from "../models/bookingModel.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'

export const createBooking = async (req, res) => {
  try {
    const { poojas, totalAmount, poojaInNameOf, poojaDate } = req.body;

    // Extract and verify token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID not found in token" });
    }

    // Validate pooja selection
    if (!poojas || !Array.isArray(poojas) || poojas.length === 0) {
      return res.status(400).json({ success: false, message: "No poojas selected" });
    }

    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: "Total amount must be greater than zero" });
    }

    // Validate pooja date format (dd-mm-yyyy)
    if (!poojaDate || !/^\d{2}-\d{2}-\d{4}$/.test(poojaDate)) {
      return res.status(400).json({ success: false, message: "Invalid date format. Use dd-mm-yyyy" });
    }

    const [day, month, year] = poojaDate.split("-");
    const formattedDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid pooja date" });
    }

    // Validate pooja IDs
    const objectIds = poojas.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid pooja ID");
      }
      return new mongoose.Types.ObjectId(id);
    });

    // Create Razorpay order
    const razorpayOrder = await RazorpayService.createOrder(totalAmount * 100); // amount in paise

    // Save booking
    const booking = new BookingModel({
      user: userId,
      poojas: objectIds,
      totalAmount,
      poojaInNameOf,
      poojaDate: formattedDate,
      status: "pending",
      receiptId: razorpayOrder.receipt,
      paymentId: razorpayOrder.id,
      paymentMethod: "Razorpay",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Pooja booked successfully",
      booking,
      razorpayOrder,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { assignedTime } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    if (!assignedTime) {
      return res.status(400).json({ success: false, message: "Assigned time is required" });
    }

    const isValidTime =
      /^([01]\d|2[0-3]):([0-5]\d)$/.test(assignedTime) ||
      /^(0?[1-9]|1[0-2]):[0-5]\d ?([APap][Mm])$/.test(assignedTime);

    if (!isValidTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:mm (24hr) or hh:mm AM/PM (12hr)",
      });
    }

    const booking = await BookingModel.findById(bookingId)
      .populate("user", "name email")
      .populate("poojas", "name description");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // ✅ Convert to 12-hour format (if it's in 24-hour format)
    const convertTo12Hour = (timeStr) => {
      if (/^(0?[1-9]|1[0-2]):[0-5]\d ?([APap][Mm])$/.test(timeStr)) {
        return timeStr.toUpperCase(); // already in 12-hour format
      }

      const [hourStr, minute] = timeStr.split(":");
      const hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      return `${hour12}:${minute} ${ampm}`;
    };

    const assignedTime12hr = convertTo12Hour(assignedTime);

    // ✅ Update booking with 12-hour time format
    booking.status = "approved";
    booking.assignedTime = assignedTime12hr;
    await booking.save();

    // Pooja list for email
    const poojaList = booking.poojas.map((p) => `<li>${p.name}</li>`).join("");

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Pooja Booking" <${process.env.EMAIL_USER}>`,
      to: booking.user.email,
      subject: "Your Pooja Booking is Approved",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #d97706; text-align: center; margin-bottom: 20px;">Pooja Booking Approved</h2>

            <p>Dear <strong>${booking.user.name}</strong>,</p>

            <p>We are pleased to inform you that your pooja booking has been <strong style="color: #fb923c;">approved</strong>.</p>

            <p><strong>Poojas:</strong></p>
            <ul style="padding-left: 20px; margin-top: 5px;">
              ${poojaList}
            </ul>

            <p><strong>Pooja In Name Of:</strong> ${booking.poojaInNameOf || "N/A"}</p>
            <p><strong>Assigned Time:</strong> ${assignedTime12hr}</p>
            <p><strong>Receipt ID:</strong> ${booking.receiptId || "N/A"}</p>

            <p style="margin-top: 20px;">Thank you for choosing our service. We look forward to serving you with devotion and sincerity.</p>

            <p style="margin-top: 30px; font-size: 14px; color: #888;">With warm regards,</p>
            <p style="font-size: 16px; font-weight: bold; color: #d97706;">KADASHIDDESHWAR TEMPLE, BANAHATTI</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Booking approved and email sent",
      booking,
    });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get all bookings for a specific user (latest first)
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const bookings = await BookingModel.find({ user: userId })
      .populate("poojas") // Populating pooja details
      .sort({ createdAt: -1 }) // Sorting by latest booking (createdAt field)
      .limit(5); // You can modify this to limit the number of latest bookings shown

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: "No bookings found" });
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all bookings for admins (latest first)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate("user", "name email")  // Populate user name and email
      .populate("poojas", "name description") // Populate pooja name and description
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(404).json({ success: false, message: "No bookings found" });
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Get the latest booking for a specific user
export const getLatestBooking = async (req, res) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Validate user ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: "Invalid or missing User ID" });
    }

    // Fetch the latest booking for the user
    const booking = await BookingModel.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .populate("poojas", "name description")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ success: false, message: "No bookings found for this user" });
    }

    // Prepare pooja details
    const poojaDetails = booking.poojas.map((pooja) => ({
      _id: pooja._id,
      name: pooja.name,
      description: pooja.description,
    }));

    // Construct response object without assignedDate, but with poojaDate
    const bookingDetails = {
      user: {
        name: booking.user.name,
        email: booking.user.email,
      },
      poojas: poojaDetails,
      totalAmount: booking.totalAmount,
      status: booking.status,
      poojaDate: booking.poojaDate,  // changed here
      assignedTime: booking.status === "approved" ? booking.assignedTime : null,
      createdAt: booking.createdAt,
      poojaInNameOf: booking.poojaInNameOf || null,
      paymentId: booking.paymentId || null,
      receiptId: booking.receiptId || null,
      paymentMethod: booking.paymentMethod || null,
    };

    // Send response
    return res.status(200).json({
      success: true,
      booking: bookingDetails,
    });
  } catch (error) {
    console.error("Error fetching latest booking:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};


// Get all pending pooja requests for admin
export const getPoojaRequests = async (req, res) => {
  try {
    const requests = await BookingModel.find({ status: 'pending' })
      .populate("user", "name email")
      .populate("poojas")
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ success: false, message: "No pending requests found." });
    }

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching pooja requests:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};