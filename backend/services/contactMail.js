import nodemailer from 'nodemailer';

const contactMail = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Please fill the required fields" });
    }

    const adminHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; background: #ffffff;">
        <h2 style="margin-top: 0;">New Contact Request</h2>
        <p>You have received a new contact request from the temple website.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
                <td style="padding: 8px; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 8px;">${name}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Message:</td>
                <td style="padding: 8px;">${message}</td>
            </tr>
        </table>

        <p>Please review and respond to this request at your earliest convenience.</p>

        <div style="font-size: 14px; color: #666; margin-top: 20px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px;">
            This is an automated email from the temple website.
        </div>
    </div>
   `;

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
            <h2 style="color: #7a5230;">Dear ${name},</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to us. Your message has been received, and we will respond to you soon.
            </p>
            <p style="background: #FFDBA2; padding: 15px; border-left: 5px solid #E38C00; font-style: italic;">
              "${message}"
            </p>
            <p>May divine blessings be with you always. 🙏</p>
            <hr style="border: 1px solid #ddd;" />
            <p style="text-align: center; font-size: 14px; color: #888;">This is an automated email. Please do not reply.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="background: #E38C00; padding: 15px;">
            <p style="color: #fff; margin: 0;">Visit us at <a href="http://KSTemple.com" style="color: #ffe7b3; text-decoration: none;">yourtemplewebsite.com</a></p>
          </td>
        </tr>
      </table>
    </div>`;

    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Request from ${name}`,
        html: adminHtml,
    };

    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us!',
        html: userHtml,
    };

    try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
        return res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ error: "Failed to send email" });
    }
};

export default contactMail;
