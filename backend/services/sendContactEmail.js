import transporter from './emailTransporter.js';
import { getDevotionalEmailTemplate } from './emailTemplates.js';
import { escapeHtml } from '../utils/escapeHtml.js';

/**
 * Sends a "Thank You" email for contacting the temple.
 */
const sendContactEmail = async ({
  email,
  name,
  message
}) => {
  const title = 'Contact Inquiry Received';

  const mainContentHtml = `
    <h3 style="color: #b45309; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #ebdcc5; padding-bottom: 8px;">Your Message Copy</h3>
    <div style="background-color: #ffffff; border-left: 4px solid #d97706; padding: 15px; font-style: italic; font-size: 14px; color: #4a3b32; line-height: 1.6; margin-bottom: 0;">
      "${escapeHtml(message)}"
    </div>
  `;

  const emailHtml = getDevotionalEmailTemplate({
    title,
    greetingName: name,
    blessingText: 'Thank you for reaching out to the Banahatti Temples Trust. Your message has been received by our office, and our representatives will respond to you soon. 🙏',
    mainContentHtml,
    quoteText: '"May peace, harmony, and divinity surround you always."'
  });

  const mailOptions = {
    from: `"Kadasiddeshwar Temple" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting us!',
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact inquiry email successfully sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Failed to send contact inquiry confirmation email:', error.message || error);
    return { success: false, error };
  }
};

export default sendContactEmail;
