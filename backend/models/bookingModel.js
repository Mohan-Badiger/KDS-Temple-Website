import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  poojas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pooja", required: true }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  paymentId: { type: String, required: false },
  receiptId: { type: String, required: false },
  paymentMethod: { type: String, required: true, default: "Razorpay" },
  poojaDate: { type: Date, required: true },
  assignedDate: { type: String }, // Consider using Date if it's a real date
  assignedTime: { type: String }, // ✅ Added this line to store assigned time
  poojaInNameOf: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BookingModel = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default BookingModel;
