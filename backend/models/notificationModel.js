import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['contact', 'feedback', 'technical_issue'], required: true },
    title: { type: String, required: true }, // e.g. "New Contact Request from John"
    message: { type: String, required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
