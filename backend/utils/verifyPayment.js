import crypto from 'crypto';

const verifyPayment = (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    console.error('Missing payment data');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return expectedSignature === razorpay_signature;
};

export default verifyPayment;
