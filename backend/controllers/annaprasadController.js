import sendAnnaprasadEmail from '../services/sendAnnaprasadEmail.js';
import Annaprasad from '../models/annaprasadModel.js';
import verifyRazorpaySignature from '../utils/verifyPayment.js';
import RazorpayService from '../services/razorpayService.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export const donateAnnaprasad = async (req, res) => {
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
    const duplicateDonation = await Annaprasad.findOne({ paymentId: razorpay_payment_id });
    if (duplicateDonation) {
      return res.status(400).json({ success: false, message: 'This donation transaction has already been recorded' });
    }

    const escapedFirstName = escapeHtml(firstName);
    const escapedLastName = escapeHtml(lastName);
    const escapedMessage = escapeHtml(message);

    // Save the annaprasad donation
    const donation = await Annaprasad.create({
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
      await sendAnnaprasadEmail({
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
      console.error('Failed to send Annaprasad donation confirmation email:', emailError);
    }

    res.json({ success: true, message: 'Annaprasad recorded & confirmation email sent.' });
  } catch (err) {
    console.error('Annaprasad error:', err);
    res.status(500).json({ success: false, message: 'Server error. Failed to record donation.' });
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
