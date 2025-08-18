
import Otp from '../Models/Otp.mjs';
import SignupData from '../Models/SignupData.mjs';
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

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.post.succ });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.post.fail });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ where: { email, otp } });

    if (!otpRecord) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: MESSAGE.get.fail });
    }

    await Otp.destroy({ where: { email, otp } }); // Remove OTP after verification

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.get.succ });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.get.fail });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await SignupData.findOne({ where: { email } });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: MESSAGE.none });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.put.succ });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.put.fail });
  }
};
