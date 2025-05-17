import nodemailer from 'nodemailer';

const sendAnnaprasadEmail = async (donationData) => {
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
      subject: '🙏 Annaprasad Donation Confirmation',
      text: `Dear ${donationData.firstName} ${donationData.lastName}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Donation confirmation email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending donation email:', error);
  }
};

export default sendAnnaprasadEmail;
