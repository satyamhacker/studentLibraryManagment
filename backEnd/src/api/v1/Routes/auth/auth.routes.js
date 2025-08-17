
import express from "express";
import {
    signupCreate,
    login,
} from "../../Controller/index.controller.js"; // Import your signupLogin controller

import validator from "../../Middleware/validators/validators.middleware.js";
import { validators } from "../../Validators/auth/index.validators.js";
import { VerifyUserJwt } from "../../Middleware/jwt.middleware.js";

const router = express.Router();

router.post("/signup", validator(validators.auth.SignupValidator), VerifyUserJwt, signupCreate); // Route for signup
router.post("/login", login); // Route for login

export default router;