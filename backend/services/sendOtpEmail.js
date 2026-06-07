import nodemailer from 'nodemailer';

const sendOtpEmail = async (toEmail, otp, subject = 'Your OTP for Password Reset', title = 'Password Reset OTP') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const otpHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; background: #ffffff;">
      <h2 style="color: #E38C00;">${title}</h2>
      <p>Hello,</p>
      <p>Your OTP is:</p>
      <p style="font-size: 24px; font-weight: bold; background: #FFDBA2; padding: 10px; border-left: 5px solid #E38C00;">${otp}</p>
      <p>This OTP is valid for the next <strong>10 minutes</strong>.</p>
      <p>If you didn’t request this, please ignore this email.</p>

      <div style="font-size: 14px; color: #666; margin-top: 20px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px;">
        This is an automated email from the temple website.
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    html: otpHtml,
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
