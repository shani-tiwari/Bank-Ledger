require('dotenv').config();
const nodemailer = require('nodemailer');

// to communicate with SMTP server
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"bank-ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


//  successful registration email
async function sendWelcomeEmail(user){
    const subject = "Welcome to Bank-Ledger";
    const text = `Hello ${user.username}, Welcome to Bank-Ledger`;
    const html = `<h1>Hello ${user.username}, Welcome to Bank-Ledger</h1>`;
    await sendEmail(user.email, subject, text, html);
}       


module.exports = { sendEmail, sendWelcomeEmail };

