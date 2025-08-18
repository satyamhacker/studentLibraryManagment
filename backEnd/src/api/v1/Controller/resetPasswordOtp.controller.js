
import Otp from '../Models/otp.model.js';
import SignupData from '../Models/signup.model.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import MESSAGE from '../Constants/message.js';

dotenv.config();

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
};

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
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

    res.status(StatusCodes.OK).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ where: { email, otp } });

    if (!otpRecord) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid OTP or email" });
    }

    await Otp.destroy({ where: { email, otp } }); // Remove OTP after verification

    res.status(StatusCodes.OK).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to verify OTP" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await SignupData.findOne({ where: { email } });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(StatusCodes.OK).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to reset password" });
  }
};
