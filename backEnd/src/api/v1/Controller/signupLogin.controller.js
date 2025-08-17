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

    const existingUser = await SignupData.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ error: MESSAGE.post.sameEntry });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new signup data record in the database
    const newSignupData = await SignupData.create({
      email,
      password: hashedPassword,
    });

    // Respond with the newly created signup data
    res.status(StatusCodes.CREATED).json({ message: MESSAGE.post.succ });
  } catch (error) {
    console.error("Error creating signup data:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: MESSAGE.error });
  }
};

export const login = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, password } = req.body;



    const user = await SignupData.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: MESSAGE.get.fail });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: MESSAGE.get.fail });
    }

    const EncodeUserJwtToken = EncodeUserJwt(email);
    res.status(StatusCodes.OK).json({ message: MESSAGE.get.succ, token: EncodeUserJwtToken });
  } catch (error) {
    console.error("Error checking login data:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: MESSAGE.error });
  }
};
