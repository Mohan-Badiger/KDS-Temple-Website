import razorpayService from '../services/razorpayService.js';
import verifyRazorpaySignature from '../utils/verifyPayment.js';

export const createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    console.log("Incoming amount:", amount);

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const amountInPaise = Math.round(numericAmount * 100);

    const order = await razorpayService.createOrder(amountInPaise);

    return res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Razorpay Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.error?.description || error.message,
    });
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
