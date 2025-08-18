

import express from "express";
import { signupCreate, login, sendOtp, verifyOtp, resetPassword } from "../../Controller/index.controller.js";

import validator from "../../Middleware/validators/validators.middleware.js";
import { validators } from "../../Validators/index.validators.js";
import { VerifyUserJwt } from "../../Middleware/jwt.middleware.js";

const router = express.Router();


router.post("/signup", validator(validators.auth.SignupValidator), signupCreate);
router.post("/login", validator(validators.auth.LoginValidator), login);
router.post("/send-otp", validator(validators.auth.sendOtpValidator), sendOtp);
router.post("/verify-otp", validator(validators.auth.verifyOtpValidator), verifyOtp);
router.post("/reset-password", validator(validators.auth.resetPasswordValidator), resetPassword);


export default router;