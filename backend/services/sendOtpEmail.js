import transporter from './emailTransporter.js';
import { getDevotionalEmailTemplate } from './emailTemplates.js';

/**
 * Sends a secure OTP verification email.
 * Includes console debugging and fallback for local development environments.
 */
const sendOtpEmail = async (toEmail, otp, subject = 'Your OTP for Verification', title = 'Verification OTP') => {
  const mainContentHtml = `
    <h3 style="color: #b45309; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #ebdcc5; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Security Code</h3>
    
    <p style="font-size: 14px; line-height: 1.6; color: #4a3b32; margin-bottom: 15px;">
      Your verification code is:
    </p>
    
    <div style="font-size: 28px; font-weight: bold; background-color: #faf0e6; color: #d97706; padding: 15px; border-left: 5px solid #d97706; text-align: center; letter-spacing: 4px; border-radius: 4px; margin-bottom: 15px;">
      ${otp}
    </div>
    
    <p style="font-size: 12px; line-height: 1.6; color: #8c7365; margin: 0;">
      This OTP is valid for the next <strong>10 minutes</strong>. For security reasons, please do not share this code with anyone. If you didn’t request this code, you can safely ignore this email.
    </p>
  `;

  const emailHtml = getDevotionalEmailTemplate({
    title,
    blessingText: 'Namaste, please verify your identity to proceed securely on the Kadasiddeshwar Temple portal. 🙏',
    mainContentHtml,
    quoteText: '"Truth is pathless, and security is the companion of a peaceful mind."'
  });

  const mailOptions = {
    from: `"Kadasiddeshwar Temple" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: emailHtml,
  };

  try {
    console.log(`\n=========================================`);
    console.log(`[OTP DEBUG] Generated OTP for ${toEmail}: ${otp}`);
    console.log(`=========================================\n`);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send OTP email via SMTP:", error.message || error);
    console.log(`\n=========================================`);
    console.log(`[DEV FALLBACK] SMTP failed. Use this OTP to log in: ${otp}`);
    console.log(`=========================================\n`);
  }
};

export default sendOtpEmail;
