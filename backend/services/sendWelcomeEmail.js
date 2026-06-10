import transporter from './emailTransporter.js';
import { getDevotionalEmailTemplate } from './emailTemplates.js';

/**
 * Sends a welcome email to a newly registered user.
 * @param {string} toEmail 
 * @param {string} userName 
 */
const sendWelcomeEmail = async (toEmail, userName) => {
  const title = 'Welcome to Kadasiddeshwar Temple';
  
  const mainContentHtml = `
    <h3 style="color: #b45309; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #ebdcc5; padding-bottom: 8px;">Account Created Successfully</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #4a3b32; margin-bottom: 15px;">
      We are delighted to welcome you to the Kadasiddeshwar Temple community. Your spiritual account has been successfully configured.
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #4a3b32; margin-bottom: 15px;">
      Through our online portal, you can now:
    </p>
    <ul style="font-size: 14px; line-height: 1.8; color: #4a3b32; padding-left: 20px; margin-bottom: 20px;">
      <li>Book Poojas online and receive official e-tickets</li>
      <li>Contribute to Annaprasad (food distribution) services</li>
      <li>Support temple development and charitable activities</li>
      <li>Access and manage your complete donation and booking history</li>
    </ul>
    <p style="font-size: 14px; line-height: 1.6; color: #4a3b32; margin-bottom: 0;">
      Thank you for connecting with us. We look forward to supporting your spiritual journey.
    </p>
  `;

  const emailHtml = getDevotionalEmailTemplate({
    title,
    greetingName: userName,
    blessingText: 'May the divine blessings of Lord Kadasiddeshwar guide you, and fill your life with peace, joy, and wisdom. 🙏',
    mainContentHtml,
    quoteText: '"May peace be unto all, may wellness be unto all, may prosperity be unto all."'
  });

  const mailOptions = {
    from: `"Kadasiddeshwar Temple" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome to Kadasiddeshwar Temple Community',
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email successfully sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Failed to send welcome email:', error.message || error);
    return { success: false, error };
  }
};

export default sendWelcomeEmail;
