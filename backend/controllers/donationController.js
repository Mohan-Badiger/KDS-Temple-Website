import nodemailer from 'nodemailer';
import Donation from '../models/donationModel.js';

export const donateController = async (req, res) => {
  try {
    const { firstName, lastName, phone, amount, message, email: bodyEmail } = req.body;
    const email = bodyEmail || (req.user ? req.user.email : null); 

    if (!firstName || !lastName || !phone || !email || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (including email) and amount must be ≥ 1',
      });
    }

    // Save the donation
    const donation = await Donation.create({
      firstName,
      lastName,
      email,
      phone,
      amount,
      message,
    });

    const formattedDate = donation.createdAt.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    await transporter.sendMail({
      from: `"Temple Donations" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Donation Confirmation – Thank You!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
    <h2 style="color: #fb923c; text-align: center;">Thank You for Your Donation!</h2>

    <p style="font-size: 16px; color: #333;">Dear <strong>${firstName} ${lastName}</strong>,</p>

    <p style="font-size: 16px; color: #555;">
      We are truly grateful for your generous contribution to Kadasiddeshwar Temple. Your donation helps us continue our spiritual services and temple activities.
    </p>

    <p style="font-size: 16px; color: #555;"><strong>Donor Name:</strong> ${firstName} ${lastName}</p>
    <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${email}</p>
    <p style="font-size: 16px; color: #555;"><strong>Phone:</strong> ${phone}</p>
    <p style="font-size: 16px; color: #555;"><strong>Donation Amount:</strong> ₹${amount}</p>
    <p style="font-size: 16px; color: #555;"><strong>Message:</strong> ${message || 'No message provided.'}</p>
    <p style="font-size: 16px; color: #555;"><strong>Date & Time:</strong> ${formattedDate}</p>

    <p style="margin-top: 30px; font-size: 16px; color: #555;">
      May you and your family be blessed with peace, health, and prosperity. We deeply appreciate your support and devotion.
    </p>

    <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
       KADASIDDESHWAR TEMPLE, BANAHATTI 
      <br/>
      Thank you once again for your generosity.
    </p>
  </div>
</div>

      `,
    });

    res.json({ success: true, message: 'Donation recorded & confirmation email sent.' });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Get all donations (admin view)
export const getAllDonations = async (_req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    console.error('Fetch donations error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
};

// Get current user's donations
export const getMyDonations = async (req, res) => {
  try {
    const userEmail = req.user.email; // From authMiddleware
    if (!userEmail) {
      return res.status(400).json({ success: false, message: "User email not found in token." });
    }

    const donations = await Donation.find({ email: userEmail.toLowerCase().trim() }).sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    console.error('Fetch my donations error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch your donations.' });
  }
};
