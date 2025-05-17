import nodemailer from 'nodemailer';

const sendDonationEmail = async (donationData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail service
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: donationData.email, 
      subject: 'Donation Confirmation',
      text: `Dear ${donationData.firstName},\n\nThank you for your generous donation of ₹${donationData.amount}.\n\nMessage: ${donationData.message || 'No message provided.'}\n\nBest Regards,\nTemple Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Donation email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending donation email:', error);
  }
};

export default sendDonationEmail;
