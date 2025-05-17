// approvePoojaMail.js
import { createTransport } from 'nodemailer';

// Create a reusable transporter object using the default SMTP transport
const transporter = createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send booking confirmation email
const sendBookingConfirmationEmail = (userEmail, poojas, assignedDate, assignedTime, totalAmount, bookingStatus) => {
  const poojaNames = poojas.map((p) => p.name).join(', ');

  const emailContent = `
    <h3>Booking Confirmation</h3>
    <p>Dear User,</p>
    <p>Your booking has been ${bookingStatus}.</p>
    <h4>Poojas Booked:</h4>
    <p>${poojaNames}</p>
    <h4>Assigned Date and Time:</h4>
    <p>${assignedDate} at ${assignedTime}</p>
    <h4>Total Amount:</h4>
    <p>₹${totalAmount}</p>
    <p>Thank you for choosing our temple services!</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail, // Recipient's email
    subject: 'Pooja Booking Confirmation', // Subject line
    html: emailContent, // HTML body content
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export default sendBookingConfirmationEmail;
