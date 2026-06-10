import transporter from './emailTransporter.js';
import { getDevotionalEmailTemplate } from './emailTemplates.js';
import { escapeHtml } from '../utils/escapeHtml.js';

/**
 * Sends an Annaprasad donation confirmation email.
 */
const sendAnnaprasadEmail = async ({
  email,
  firstName,
  lastName,
  phone,
  amount,
  message,
  paymentId,
  formattedDate
}) => {
  const title = 'Annaprasad Offering Receipt';
  const fullName = `${firstName} ${lastName}`;

  const mainContentHtml = `
    <h3 style="color: #b45309; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #ebdcc5; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Official Offering Receipt</h3>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; font-size: 14px; line-height: 1.8;">
      <tr>
        <td style="color: #8c7365; padding: 4px 0;">Devotee Name:</td>
        <td style="font-weight: 600; color: #4a3b32; text-align: right; padding: 4px 0;">${escapeHtml(fullName)}</td>
      </tr>
      <tr>
        <td style="color: #8c7365; padding: 4px 0;">Email:</td>
        <td style="font-weight: 600; color: #4a3b32; text-align: right; padding: 4px 0;">${escapeHtml(email)}</td>
      </tr>
      <tr>
        <td style="color: #8c7365; padding: 4px 0;">Phone:</td>
        <td style="font-weight: 600; color: #4a3b32; text-align: right; padding: 4px 0;">${escapeHtml(phone)}</td>
      </tr>
      <tr>
        <td style="color: #8c7365; padding: 4px 0;">Date & Time:</td>
        <td style="font-weight: 600; color: #4a3b32; text-align: right; padding: 4px 0;">${escapeHtml(formattedDate)}</td>
      </tr>
      <tr>
        <td style="color: #8c7365; padding: 4px 0; vertical-align: top;">Sankalpa/Message:</td>
        <td style="font-weight: 600; color: #4a3b32; text-align: right; padding: 4px 0; max-width: 250px; word-wrap: break-word;">${escapeHtml(message || 'No message provided.')}</td>
      </tr>
    </table>

    <div style="border-top: 2px dashed #ebdcc5; padding-top: 15px; margin-bottom: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="left">
            <span style="font-size: 12px; font-weight: 700; color: #8c7365; text-transform: uppercase; letter-spacing: 1px;">Annadanam Offering</span>
          </td>
          <td align="right">
            <span style="font-size: 20px; font-weight: 700; color: #d97706;">₹${amount}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="background-color: #ffffff; border: 1px solid #ebdcc5; border-radius: 6px; padding: 12px; font-size: 11px; color: #8c7365; line-height: 1.6; text-align: center;">
      <p style="margin: 0;"><strong>Payment Transaction ID:</strong> ${escapeHtml(paymentId)}</p>
      <p style="margin: 0; font-size: 10px; color: #a3a3a3; margin-top: 4px;">Thank you for feeding the community and sharing divine prasad.</p>
    </div>
  `;

  const emailHtml = getDevotionalEmailTemplate({
    title,
    greetingName: fullName,
    blessingText: 'We are deeply grateful for your noble contribution towards the Annaprasad (holy meals/food distribution) services at Kadasiddeshwar Temple. Annadanam is considered one of the highest virtues in our sacred traditions, and your generosity helps provide meals to countless devotees. 🙏',
    mainContentHtml,
    quoteText: '"Share food with others, as feeding the hungry is serving the divine."'
  });

  const mailOptions = {
    from: `"Annaprasad Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Annaprasad Donation Confirmation – Thank You!',
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Annaprasad donation email successfully sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Failed to send Annaprasad donation email:', error.message || error);
    return { success: false, error };
  }
};

export default sendAnnaprasadEmail;
