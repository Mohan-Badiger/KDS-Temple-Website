import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true }, // ✅ Added temple
  poojas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pooja", required: true }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "pending", "approved", "completed"], default: "confirmed" }, // ✅ Defaulting to confirmed
  paymentId: { type: String, required: false },
  receiptId: { type: String, required: false },
  paymentMethod: { type: String, required: true, default: "Razorpay" },
  poojaDate: { type: Date, required: true },
  assignedDate: { type: String }, 
  assignedTime: { type: String },
  poojaInNameOf: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BookingModel = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default BookingModel;
