import { EncodeUserJwt } from "../Middleware/Jwt.mjs";
import SignupData from "../Models/SignupData.mjs";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

export const signupCreate = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, password } = req.body;



    // Check if the user already exists
    const existingUser = await SignupData.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" }); // Conflict status
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new signup data record in the database
    const newSignupData = await SignupData.create({
      email,
      password: hashedPassword,
    });

    // Respond with the newly created signup data
    res.status(201).json("User created");
  } catch (error) {
    console.error("Error creating signup data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, password } = req.body;


    const user = await SignupData.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" }); // Unauthorized if user not found
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" }); // Unauthorized if passwords do not match
    }

    const EncodeUserJwtToken = EncodeUserJwt(email);
    res.status(200).json(["Login successful", EncodeUserJwtToken]); // Changed status to 200 for success
  } catch (error) {
    console.error("Error checking login data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
