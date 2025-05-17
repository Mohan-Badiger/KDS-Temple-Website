import razorpayService from '../services/razorpayService.js';
import verifyRazorpaySignature from '../utils/verifyPayment.js';

export const createOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpayService.createOrder(amount);
    res.json(order); // Return full order object
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send('Error creating Razorpay order');
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    const isVerified = verifyRazorpaySignature(razorpay_payment_id, razorpay_order_id, razorpay_signature);

    if (isVerified) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};
