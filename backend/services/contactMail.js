import sendContactEmail from './sendContactEmail.js';
import Contact from '../models/contactModel.js';
import Notification from '../models/notificationModel.js';
import { escapeHtml } from '../utils/escapeHtml.js';

const contactMail = async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Please fill the required fields" });
    }

    try {
        const escapedName = escapeHtml(name);
        const escapedMessage = escapeHtml(message);

        // 1. Save Contact to DB
        const newContact = new Contact({ name: escapedName, email, message: escapedMessage });
        await newContact.save();

        // 2. Create Notification for Admin
        const newNotification = new Notification({
            type: 'contact',
            title: `New Contact Request from ${escapedName}`,
            message: escapedMessage.substring(0, 100) + (escapedMessage.length > 100 ? '...' : ''),
            referenceId: newContact._id
        });
        await newNotification.save();

        // 3. Send "Thank You" email to User ONLY
        await sendContactEmail({
            email,
            name: escapedName,
            message: escapedMessage
        });

        return res.status(200).json({ success: true, message: "Response received. We will contact you soon." });
    } catch (error) {
        console.error("Contact form error:", error);
        return res.status(500).json({ error: "Failed to process your request. Please try again later." });
    }
};

export default contactMail;
