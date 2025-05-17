import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const createOrder = async (amount) => {
  const options = {
    amount: amount, 
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  return await razorpay.orders.create(options);
};

export default { createOrder };
