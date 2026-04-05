import Feedback from '../models/feedbackModel.js';
import Notification from '../models/notificationModel.js';

const submitFeedback = async (req, res) => {
    const { name, email, type, message } = req.body;

    if (!name || !email || !type || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // 1. Save Feedback to DB
        const newFeedback = new Feedback({ name, email, type, message });
        await newFeedback.save();

        // 2. Create Notification for Admin
        const isBug = type === 'Technical Issue';
        const newNotification = new Notification({
            type: isBug ? 'technical_issue' : 'feedback',
            title: isBug ? `⚠️ Technical Issue from ${name}` : `💡 New Suggestion from ${name}`,
            message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
            referenceId: newFeedback._id
        });
        await newNotification.save();

        return res.status(200).json({ success: true, message: "Feedback submitted successfully. Thank you!" });
    } catch (error) {
        console.error("Feedback submission error:", error);
        return res.status(500).json({ error: "Failed to submit feedback" });
    }
};

export { submitFeedback };
