import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, enum: ['Technical Issue', 'Improvement'], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
export default Feedback;
