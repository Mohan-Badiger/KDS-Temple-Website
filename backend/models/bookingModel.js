import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  poojas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pooja", required: true }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  paymentId: { type: String, required: false }, 
  receiptId: { type: String, required: false },
  paymentMethod: { type: String, required: true, default: "Razorpay" }, 
  assignedDate: { type: Date },
  poojaInNameOf: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const BookingModel = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default BookingModel;



