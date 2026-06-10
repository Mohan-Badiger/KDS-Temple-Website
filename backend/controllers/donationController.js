import sendDonationEmail from '../services/sendDonationEmail.js';
import Donation from '../models/donationModel.js';
import verifyRazorpaySignature from '../utils/verifyPayment.js';
import RazorpayService from '../services/razorpayService.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export const donateController = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phone, 
      amount, 
      message, 
      email: bodyEmail, 
      templeId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    
    const email = bodyEmail || (req.user ? req.user.email : null); 

    if (!firstName || !lastName || !phone || !email || !templeId || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (including temple) and amount must be ≥ 1',
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment transaction details missing' });
    }

    // 1. Verify Razorpay Signature
    const isSignatureValid = verifyRazorpaySignature(razorpay_payment_id, razorpay_order_id, razorpay_signature);
    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // 2. Fetch Razorpay Order and Verify Amount
    const orderDetails = await RazorpayService.fetchOrder(razorpay_order_id);
    if (orderDetails.amount !== amount * 100) {
      return res.status(400).json({ success: false, message: 'Payment amount verification failed' });
    }

    // 3. Prevent duplicate donations
    const duplicateDonation = await Donation.findOne({ paymentId: razorpay_payment_id });
    if (duplicateDonation) {
      return res.status(400).json({ success: false, message: 'This donation transaction has already been recorded' });
    }

    const escapedFirstName = escapeHtml(firstName);
    const escapedLastName = escapeHtml(lastName);
    const escapedMessage = escapeHtml(message);

    // Save the donation
    const donation = await Donation.create({
      firstName: escapedFirstName,
      lastName: escapedLastName,
      email,
      phone,
      amount,
      message: escapedMessage,
      temple: templeId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    const formattedDate = donation.createdAt.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Send confirmation email
    try {
      await sendDonationEmail({
        email,
        firstName: escapedFirstName,
        lastName: escapedLastName,
        phone,
        amount,
        message: escapedMessage,
        paymentId: razorpay_payment_id,
        formattedDate
      });
    } catch (emailError) {
      console.error('Failed to send donation confirmation email:', emailError);
    }
  
    res.json({ success: true, message: 'Donation recorded successfully.' });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ success: false, message: 'Server error. Failed to record donation.' });
  }
};

// Get all donations (admin view)
export const getAllDonations = async (_req, res) => {
  try {
    const donations = await Donation.find().populate('temple', 'name location').sort({ createdAt: -1 });
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

    const donations = await Donation.find({ email: userEmail.toLowerCase().trim() }).populate('temple', 'name location').sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    console.error('Fetch my donations error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch your donations.' });
  }
};

// Get aggregated sum of all donations
export const getDonationsTotal = async (req, res) => {
  try {
    const totalResult = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;
    res.json({ success: true, total });
  } catch (err) {
    console.error('Fetch donation total error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch donation total.' });
  }
};
