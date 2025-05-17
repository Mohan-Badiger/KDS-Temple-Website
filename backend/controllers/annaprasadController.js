import nodemailer from 'nodemailer';
import Annaprasad from '../models/annaprasadModel.js';

export const donateAnnaprasad = async (req, res) => {
  try {
    const { firstName, lastName, phone, amount, message } = req.body;
    const email = req.user.email; // This is set by adminAuth middleware

    // Validate fields
    if (!firstName || !lastName || !phone || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required and amount must be ≥ 1'
      });
    }

    // Save to DB
    const annaprasad = await Annaprasad.create({
      firstName,
      lastName,
      phone,
      amount,
      message,
      email,
    });

    const formattedDate = annaprasad.createdAt.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // Setup email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send confirmation email
    await transporter.sendMail({
      from: `"Temple Annaprasad" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Annaprasad Donation Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 5px 10px rgba(0,0,0,0.1);">
    
        <h2 style="text-align: center; color: #fb923c; margin-bottom: 20px;">Thank You for Your Annaprasad Donation!</h2>
        
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Dear <strong>${firstName} ${lastName}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
            We are grateful to have received your generous Annaprasad donation of <strong>₹${amount}</strong> on <strong>${formattedDate}</strong>.
        </p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
            <strong>Message:</strong> ${message || 'No message provided'}
        </p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Your support means a lot to us. May you and your family be blessed abundantly!
        </p>
        
        <div style="font-size: 14px; color: #999; text-align: center; margin-top: 40px; line-height: 1.5;">
            <p>
                KADASIDDESHWAR TEMPLE, BANAHATTI<br/>
                Thank you once again for supporting our temple.
            </p>
        </div>
    
    </div>
</div>


      `
    });

    return res.status(201).json({
      success: true,
      message: 'Donation recorded & confirmation email sent.',
      annaprasad
    });

  } catch (err) {
    console.error('Annaprasad Donation error:', err);  // Log detailed error
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

export const getAnnaprasadDonations = async (req, res) => {
  try {
    const annaprasads = await Annaprasad.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, annaprasads });
  } catch (err) {
    console.error('Fetch Annaprasad Donations error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
};
