import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  message: { type: String, default: '' },
  // razorpay
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);
