const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTPEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // use your email service
    auth: {
        user: process.env.MAIL_ID, // replace with your email
        pass: process.env.MAIL_PASSWORD, // replace with your email password
    },
  });

  let mailOptions = {
    from: 'your-email@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}`, // plain text body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };
