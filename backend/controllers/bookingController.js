import RazorpayService from "../services/razorpayService.js";
import mongoose from "mongoose";
import BookingModel from "../models/bookingModel.js";
import PoojaModel from "../models/poojaModel.js";
import nodemailer from 'nodemailer';

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createBooking = async (req, res) => {
  try {
    const { poojas, totalAmount, poojaInNameOf, poojaDate, templeId } = req.body;
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

    // Check availability (Server-side validation)
    const [day, month, year] = poojaDate.split("-");
    const isoDateStr = `${year}-${month}-${day}`; // YYYY-MM-DD

    // 1. Check Temple-wide restrictions (Festival/Closure)
    const temple = await mongoose.model("Temple").findById(templeId);
    if (temple?.unavailableDates?.includes(isoDateStr)) {
      return res.status(400).json({ 
        success: false, 
        message: `The ${temple.name} is closed on ${poojaDate} due to a festival or maintenance. Please select another date.` 
      });
    }

    // 2. Check Service-specific restrictions
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

    // Amount in paise for Razorpay
    const razorpayOrder = await RazorpayService.createOrder(totalAmount * 100);

    const formattedDate = new Date(`${year}-${month}-${day}`);

    const booking = new BookingModel({
      user: userId,
      temple: templeId,
      poojas,
      totalAmount,
      poojaInNameOf,
      poojaDate: formattedDate,
      status: "confirmed", // Instant confirmation
      receiptId: razorpayOrder.receipt,
      paymentId: razorpayOrder.id,
      paymentMethod: "Razorpay",
    });

    await booking.save();

    // Populate for email
    const populatedBooking = await BookingModel.findById(booking._id)
      .populate("user", "name email")
      .populate("temple", "name location")
      .populate("poojas", "name price");

    // Send confirmation email
    const poojaList = populatedBooking.poojas.map((p) => `<li style="margin-bottom: 8px;"><strong>${p.name}</strong> <span style="color: #f97316;">(₹${p.price})</span></li>`).join("");
    const mailOptions = {
      from: `"Banahatti Temples Trust" <${process.env.EMAIL_USER}>`,
      to: populatedBooking.user.email,
      subject: "Your Official E-Ticket - Pooja Booking Confirmed",
      html: `
        <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e4e8; border-radius: 8px; overflow: hidden; color: #1f2937; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background-color: #f97316; padding: 35px 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;">Banahatti Temples Management Trust Committee</p>
            <h1 style="margin: 15px 0 0; font-size: 26px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase;">Official E-Ticket</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <p style="margin: 0 0 30px; font-size: 15px; color: #4b5563; text-align: center; line-height: 1.6;">
              Namaskara <strong>${populatedBooking.user.name}</strong>,<br/> Your divine reservation has been successfully secured.
            </p>
            
            <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 25px; margin-bottom: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td width="50%" valign="top">
                    <p style="margin: 0 0 5px; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Devotee Details</p>
                    <p style="margin: 0; font-size: 15px; font-weight: 600;">${poojaInNameOf}</p>
                    <p style="margin: 5px 0 0; font-size: 11px; color: #6b7280; font-style: italic;">Pooja in the name of</p>
                  </td>
                  <td width="50%" valign="top" style="text-align: right;">
                    <p style="margin: 0 0 5px; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Scheduled Date</p>
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #111827;">${poojaDate}</p>
                  </td>
                </tr>
              </table>

              <div style="margin-bottom: 25px;">
                <p style="margin: 0 0 5px; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Temple Destination</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">${populatedBooking.temple.name}</p>
                <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">${populatedBooking.temple.location}</p>
              </div>

              <div style="margin-bottom: 5px;">
                <p style="margin: 0 0 10px; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Selected Services</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #374151;">${poojaList}</ul>
              </div>

              <div style="border-top: 2px dashed #e5e7eb; margin: 25px 0 0; padding-top: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left"><span style="font-size: 12px; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 1px;">Total Offering</span></td>
                    <td align="right"><span style="font-size: 22px; font-weight: 700; color: #f97316;">₹${totalAmount}</span></td>
                  </tr>
                </table>
              </div>
            </div>

            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; font-size: 12px; color: #6b7280; line-height: 1.8; margin-bottom: 35px; text-align: center;">
              <p style="margin: 0;"><strong>Payment ID:</strong> ${booking.paymentId || "rzp_verified"}</p>
              <p style="margin: 0;"><strong>Order ID:</strong> ${booking.receiptId || "N/A"}</p>
              <p style="margin: 0;"><strong>Booking Ref:</strong> #${populatedBooking._id}</p>
            </div>

            <p style="text-align: center; margin: 0; font-size: 16px; font-style: italic; color: #d97706; font-weight: 500; line-height: 1.5;">
              "May the continuous flow of divine grace illuminate your path and bring profound peace."
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px; border-top: 1px solid #e5e7eb;">
            System Auto-Generated Label • Do not reply directly to this email
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await BookingModel.find({ user: userId })
      .populate("temple", "name location")
      .populate("poojas", "name price description")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await BookingModel.findOne({ user: userId })
      .populate("temple", "name location")
      .populate("poojas", "name price description")
      .sort({ createdAt: -1 });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};