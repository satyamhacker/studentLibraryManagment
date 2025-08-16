import Otp from '../Models/Otp.mjs';
import SignupData from '../Models/SignupData.mjs';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
};

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Library OTP Code For Reset Password',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOtp();
    await Otp.create({ email, otp });

    await sendOtpEmail(email, otp);

    res.status(200).json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP.' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ where: { email, otp } });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    await Otp.destroy({ where: { email, otp } }); // Remove OTP after verification

    res.status(200).json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP.' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await SignupData.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Error resetting password.' });
  }
};
