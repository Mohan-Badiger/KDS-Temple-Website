import RazorpayService from "../services/razorpayService.js"
import mongoose from "mongoose";
import BookingModel from "../models/bookingModel.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { poojas, totalAmount, poojaInNameOf } = req.body;

    // Extract token from the request header
    const token = req.headers.authorization?.split(" ")[1]; // Assumes token is passed as "Bearer <token>"

    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    if (totalAmount <= 0) { // Check for totalAmount <= 0 instead of just 0
      return res.status(400).json({ success: false, message: "Total amount must be greater than zero" });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT_SECRET here
    const userId = decoded.id; // Assuming the JWT token contains a user ID as 'id'

    console.log("Decoded user ID:", userId);

    // Validate that pooja IDs are valid
    const objectIds = poojas.map((id) => new mongoose.Types.ObjectId(id));
    if (objectIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, message: "Invalid pooja ID(s)" });
    }

    // Create Razorpay order
    const razorpayOrder = await RazorpayService.createOrder(totalAmount); // Create Razorpay order

    // Proceed to save the booking
    const booking = new BookingModel({
      user: userId,
      poojas: objectIds,
      totalAmount,
      poojaInNameOf,
      status: "pending",
      receiptId: razorpayOrder.receipt,
      paymentId: razorpayOrder.id, // 
      paymentMethod: "Razorpay",
    });

    await booking.save();

    // Return response with Razorpay order details to client
    res.status(201).json({
      success: true,
      message: "Pooja Booked Successfully",
      booking,
      razorpayOrder,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// // Approve a booking
// export const approveBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const { assignedDate } = req.body;

//     // Validate booking ID format
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       return res.status(400).json({ success: false, message: "Invalid booking ID" });
//     }

//     // Validate assignedDate (make sure it's not empty and is a valid date)
//     if (!assignedDate) {
//       return res.status(400).json({ success: false, message: "Assigned date is required" });
//     }

//     const parsedDate = new Date(assignedDate);

//     // Ensure the assignedDate is a valid date
//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({ success: false, message: "Invalid date format" });
//     }

//     // Update the booking using findByIdAndUpdate
//     const updatedBooking = await BookingModel.findByIdAndUpdate(
//       bookingId,
//       { status: "approved", assignedDate: parsedDate },
//       { new: true } // Return the updated booking
//     );

//     // Check if the booking was found and updated
//     if (!updatedBooking) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     // Respond with the updated booking
//     res.status(200).json({ success: true, message: "Booking approved", booking: updatedBooking });
//   } catch (error) {
//     console.error("Error approving booking:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

export const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { assignedDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    if (!assignedDate) {
      return res.status(400).json({ success: false, message: "Assigned date is required" });
    }

    const parsedDate = new Date(assignedDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Fetch booking with populated user and pooja details
    const booking = await BookingModel.findById(bookingId)
      .populate("user", "name email")
      .populate("poojas", "name description");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Update booking status and assignedDate
    booking.status = "approved";
    booking.assignedDate = parsedDate;
    await booking.save();

    // Format pooja list for email
    const poojaList = booking.poojas.map(p => `<li>${p.name}</li>`).join("");

    // Configure Nodemailer
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
    <p><strong>Assigned Date & Time:</strong> ${new Date(assignedDate).toLocaleString()}</p>
    <p><strong>Receipt ID:</strong> ${booking.receiptId || "N/A"}</p>

    <p style="margin-top: 20px;">Thank you for choosing our service. We look forward to serving you with devotion and sincerity.</p>

    <p style="margin-top: 30px; font-size: 14px; color: #888;">With warm regards,</p>
    <p style="font-size: 16px; font-weight: bold; color: #d97706;">KADASHIDDESHWAR TEMPLE, BANAHATTI</p>
  </div>
</div>

      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Booking approved and email sent", booking });

  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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

    // Construct response object
    const bookingDetails = {
      user: {
        name: booking.user.name,
        email: booking.user.email,
      },
      poojas: poojaDetails,
      totalAmount: booking.totalAmount,
      status: booking.status,
      assignedDate: booking.status === "approved" ? booking.assignedDate : null,
      assignedTime: booking.status === "approved" ? booking.assignedTime : null,
      createdAt: booking.createdAt,
      poojaInNameOf: booking.poojaInNameOf || null,
      paymentId: booking.paymentId || null,
      receiptId: booking.receiptId || null,
      paymentMethod: booking.paymentMethod || null,  // Ensure payment method is included
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
