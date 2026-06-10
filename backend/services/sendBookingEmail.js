import transporter from './emailTransporter.js';
import { getDevotionalEmailTemplate } from './emailTemplates.js';
import { escapeHtml } from '../utils/escapeHtml.js';

/**
 * Sends a pooja booking confirmation E-Ticket email.
 */
const sendBookingEmail = async ({
  userEmail,
  userName,
  devoteeName,
  poojaDate,
  templeName,
  templeLocation,
  poojas,
  totalAmount,
  paymentId,
  receiptId,
  bookingId
}) => {
  const title = 'Pooja Booking E-Ticket';

  const poojaListHtml = poojas
    .map(
      (p) =>
        `<li style="margin-bottom: 6px; font-size: 14px;">
          <strong>${escapeHtml(p.name)}</strong> 
          <span style="color: #d97706; font-weight: 600;">(₹${p.price})</span>
         </li>`
    )
    .join('');

  const mainContentHtml = `
    <h3 style="color: #b45309; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #ebdcc5; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Official E-Ticket Details</h3>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tr>
        <td width="50%" valign="top" style="padding-bottom: 15px;">
          <p style="margin: 0 0 4px; font-size: 10px; color: #8c7365; text-transform: uppercase; letter-spacing: 1px;">Devotee Name</p>
          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #4a3b32;">${escapeHtml(devoteeName)}</p>
          <p style="margin: 2px 0 0; font-size: 11px; color: #8c7365; font-style: italic;">Pooja performed in this name</p>
        </td>
        <td width="50%" valign="top" style="text-align: right; padding-bottom: 15px;">
          <p style="margin: 0 0 4px; font-size: 10px; color: #8c7365; text-transform: uppercase; letter-spacing: 1px;">Scheduled Date</p>
          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #4a3b32;">${escapeHtml(poojaDate)}</p>
        </td>
      </tr>
      <tr>
        <td colspan="2" valign="top" style="padding-bottom: 15px; border-top: 1px solid #ebdcc5; padding-top: 12px;">
          <p style="margin: 0 0 4px; font-size: 10px; color: #8c7365; text-transform: uppercase; letter-spacing: 1px;">Temple Destination</p>
          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #4a3b32;">${escapeHtml(templeName)}</p>
          <p style="margin: 2px 0 0; font-size: 12px; color: #8c7365;">${escapeHtml(templeLocation)}</p>
        </td>
      </tr>
      <tr>
        <td colspan="2" valign="top" style="padding-bottom: 15px; border-top: 1px solid #ebdcc5; padding-top: 12px;">
          <p style="margin: 0 0 8px; font-size: 10px; color: #8c7365; text-transform: uppercase; letter-spacing: 1px;">Selected Services</p>
          <ul style="margin: 0; padding-left: 20px; color: #4a3b32; line-height: 1.6;">
            ${poojaListHtml}
          </ul>
        </td>
      </tr>
    </table>

    <div style="border-top: 2px dashed #ebdcc5; padding-top: 15px; margin-bottom: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="left">
            <span style="font-size: 12px; font-weight: 700; color: #8c7365; text-transform: uppercase; letter-spacing: 1px;">Total Offering</span>
          </td>
          <td align="right">
            <span style="font-size: 20px; font-weight: 700; color: #d97706;">₹${totalAmount}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="background-color: #ffffff; border: 1px solid #ebdcc5; border-radius: 6px; padding: 12px; font-size: 11px; color: #8c7365; line-height: 1.6; text-align: center;">
      <p style="margin: 0;"><strong>Payment ID:</strong> ${escapeHtml(paymentId || 'rzp_verified')}</p>
      <p style="margin: 0;"><strong>Order ID:</strong> ${escapeHtml(receiptId || 'N/A')}</p>
      <p style="margin: 0;"><strong>Booking Ref:</strong> #${escapeHtml(bookingId)}</p>
    </div>
  `;

  const emailHtml = getDevotionalEmailTemplate({
    title,
    greetingName: userName,
    blessingText: 'Namaskara, your divine pooja reservation has been successfully confirmed. May the sacred energy of the deities bring peace, health, and prosperity to you and your loved ones. 🙏',
    mainContentHtml,
    quoteText: '"May the continuous flow of divine grace illuminate your path and bring profound peace."'
  });

  const mailOptions = {
    from: `"Banahatti Temples Trust" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Your Official E-Ticket - Pooja Booking Confirmed',
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking email successfully sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error.message || error);
    return { success: false, error };
  }
};

export default sendBookingEmail;
