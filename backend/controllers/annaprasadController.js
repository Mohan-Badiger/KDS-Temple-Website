import nodemailer from 'nodemailer';
import Annaprasad from '../models/annaprasadModel.js';

export const donateAnnaprasad = async (req, res) => {
  try {
    const { firstName, lastName, phone, amount, message, email: bodyEmail, templeId } = req.body;
    const email = bodyEmail || (req.user ? req.user.email : null); 

    if (!firstName || !lastName || !phone || !email || !templeId || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (including temple) and amount must be ≥ 1',
      });
    }

    // Save the annaprasad donation
    const donation = await Annaprasad.create({
      firstName,
      lastName,
      email,
      phone,
      amount,
      message,
      temple: templeId,
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
      from: `"Annaprasad Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Annaprasad Donation Confirmation – Thank You!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
    <h2 style="color: #fb923c; text-align: center;">Thank You for Your Annaprasad Donation!</h2>

    <p style="font-size: 16px; color: #333;">Dear <strong>${firstName} ${lastName}</strong>,</p>

    <p style="font-size: 16px; color: #555;">
      We are deeply grateful for your contribution towards the Annaprasad (food distribution) at Kadasiddeshwar Temple. Your generosity helps provide meals to countless devotees.
    </p>

    <p style="font-size: 16px; color: #555;"><strong>Donor Name:</strong> ${firstName} ${lastName}</p>
    <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${email}</p>
    <p style="font-size: 16px; color: #555;"><strong>Phone:</strong> ${phone}</p>
    <p style="font-size: 16px; color: #555;"><strong>Donation Amount:</strong> ₹${amount}</p>
    <p style="font-size: 16px; color: #555;"><strong>Message:</strong> ${message || 'No message provided.'}</p>
    <p style="font-size: 16px; color: #555;"><strong>Date & Time:</strong> ${formattedDate}</p>

    <p style="margin-top: 30px; font-size: 16px; color: #555;">
      May you and your family be blessed with peace, health, and prosperity. We deeply appreciate your support.
    </p>

    <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
       KADASIDDESHWAR TEMPLE, BANAHATTI 
      <br/>
      Thank you once again for your kindness.
    </p>
  </div>
</div>
      `,
    });

    res.json({ success: true, message: 'Annaprasad recorded & confirmation email sent.' });
  } catch (err) {
    console.error('Annaprasad error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Get all annaprasads (admin view)
export const getAllAnnaprasads = async (_req, res) => {
  try {
    const annaprasads = await Annaprasad.find().populate('temple', 'name location').sort({ createdAt: -1 });
    res.json({ success: true, annaprasads });
  } catch (err) {
    console.error('Fetch annaprasads error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch annaprasad records.' });
  }
};
