import crypto from 'crypto';

const verifyPayment = (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
  try {
    // ✅ Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error('Missing payment data');
      return false;
    }

    // ✅ ONLY use backend secret (never VITE here)
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is missing in backend .env');
      return false;
    }

    // ✅ Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret.trim())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // ✅ Compare signatures
    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error('Signature mismatch', {
        expectedSignature,
        razorpay_signature,
      });
    }

    return isValid;

  } catch (error) {
    console.error('Error in payment verification:', error);
    return false;
  }
};

export default verifyPayment;