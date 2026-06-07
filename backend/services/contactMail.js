import nodemailer from 'nodemailer';
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
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const userHtml = `
         <div style="background-color: #fff; padding: 20px; font-family: 'Arial', sans-serif; color: #4a362d;">
          <table align="center" width="600" style="background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="background:  #E38C00; padding: 20px;">
                <h1 style="color: #fff; margin: 0;">Divine Blessings</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #7a5230;">Dear ${escapedName},</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                  Thank you for reaching out to us. Your message has been received, and we will respond to you soon.
                </p>
                <p style="background: #FFDBA2; padding: 15px; border-left: 5px solid #E38C00; font-style: italic;">
                  "${escapedMessage}"
                </p>
                <p>May divine blessings be with you always. 🙏</p>
                <hr style="border: 1px solid #ddd;" />
                <p style="text-align: center; font-size: 14px; color: #888;">This is an automated email. Please do not reply.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background: #E38C00; padding: 15px;">
                <p style="color: #fff; margin: 0;">Visit us at <a href="http://KSTemple.com" style="color: #ffe7b3; text-decoration: none;">Banahattitemples.com</a></p>
              </td>
            </tr>
          </table>
        </div>`;

        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting us!',
            html: userHtml,
        };

        await transporter.sendMail(userMailOptions);

        return res.status(200).json({ success: true, message: "Response received. We will contact you soon." });
    } catch (error) {
        console.error("Contact form error:", error);
        return res.status(500).json({ error: "Failed to process your request. Please try again later." });
    }
};

export default contactMail;
