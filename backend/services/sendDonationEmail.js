import transporter from './emailTransporter.js';
import { getDevotionalEmailTemplate } from './emailTemplates.js';
import { escapeHtml } from '../utils/escapeHtml.js';

/**
 * Sends a donation confirmation email.
 */
const sendDonationEmail = async ({
  email,
  firstName,
  lastName,
  phone,
  amount,
  message,
  paymentId,
  formattedDate
}) => {
  const title = 'Donation Receipt';
  const fullName = `${firstName} ${lastName}`;

  const mainContentHtml = `
    <h3 style="color: #b45309; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #ebdcc5; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Official Receipt</h3>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; font-size: 14px; line-height: 1.8;">
      <tr>
        <td style="color: #8c7365; padding: 4px 0;">Donor Name:</td>
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
        <td style="color: #8c7365; padding: 4px 0; vertical-align: top;">Message:</td>
        <td style="font-weight: 600; color: #4a3b32; text-align: right; padding: 4px 0; max-width: 250px; word-wrap: break-word;">${escapeHtml(message || 'No message provided.')}</td>
      </tr>
    </table>

    <div style="border-top: 2px dashed #ebdcc5; padding-top: 15px; margin-bottom: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="left">
            <span style="font-size: 12px; font-weight: 700; color: #8c7365; text-transform: uppercase; letter-spacing: 1px;">Contribution Amount</span>
          </td>
          <td align="right">
            <span style="font-size: 20px; font-weight: 700; color: #d97706;">₹${amount}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="background-color: #ffffff; border: 1px solid #ebdcc5; border-radius: 6px; padding: 12px; font-size: 11px; color: #8c7365; line-height: 1.6; text-align: center;">
      <p style="margin: 0;"><strong>Payment Transaction ID:</strong> ${escapeHtml(paymentId)}</p>
      <p style="margin: 0; font-size: 10px; color: #a3a3a3; margin-top: 4px;">Thank you for your noble gesture and support.</p>
    </div>
  `;

  const emailHtml = getDevotionalEmailTemplate({
    title,
    greetingName: fullName,
    blessingText: 'We are truly grateful for your generous contribution to Kadasiddeshwar Temple. Your donation helps us continue our spiritual services, maintain holy sites, and fund our public activities. 🙏',
    mainContentHtml,
    quoteText: '"Giving is the greatest act of grace. May the Lord bless your generosity."'
  });

  const mailOptions = {
    from: `"Temple Donations" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Donation Confirmation – Thank You!',
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Donation email successfully sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Failed to send donation confirmation email:', error.message || error);
    return { success: false, error };
  }
};

export default sendDonationEmail;
