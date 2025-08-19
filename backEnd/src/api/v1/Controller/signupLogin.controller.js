import { EncodeUserJwt } from "../Middleware/index.middleware.js";
import SignupData from "../Models/signup.model.js";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../Constants/message.js";

export const signupCreate = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, password } = req.body;

    // Check if the user already exists

    const existingUser = await SignupData.findOne({ where: { email } });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Email already exists. Please use a different email or login."
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new signup data record in the database
    const newSignupData = await SignupData.create({
      email,
      password: hashedPassword,
    });

    // Respond with the newly created signup data
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Signup successful! You can now login with your credentials."
    });
  } catch (error) {
    console.error("Error creating signup data:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while creating your account. Please try again later."
    });
  }
};

export const login = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, password } = req.body;



    const user = await SignupData.findOne({ where: { email } });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password. Please check your credentials and try again."
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password. Please check your credentials and try again."
      });
    }

    const EncodeUserJwtToken = EncodeUserJwt(user.id, user.email);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful! Welcome back.",
      token: EncodeUserJwtToken
    });
  } catch (error) {
    console.error("Error checking login data:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred during login. Please try again later."
    });
  }
};
