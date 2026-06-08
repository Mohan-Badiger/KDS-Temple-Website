import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: (process.env.RAZORPAY_KEY_ID || '').replace(/['"]/g, '').trim(),
  key_secret: (process.env.RAZORPAY_KEY_SECRET || '').replace(/['"]/g, '').trim(),
});

const createOrder = async (amount) => {
  if (!amount || amount < 1) {
    throw new Error("Invalid amount");
  }

  const options = {
    amount: amount, // already in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  return await razorpay.orders.create(options);
};

const fetchOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  return await razorpay.orders.fetch(orderId);
};

export default { createOrder, fetchOrder };