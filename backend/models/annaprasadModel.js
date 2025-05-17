import mongoose from 'mongoose';

const annaprasadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },  // Added email field
  amount: { type: Number, required: true, min: 1 },
  message: { type: String, default: '' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Annaprasad', annaprasadSchema);
