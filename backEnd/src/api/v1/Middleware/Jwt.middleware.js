import jwt from "jsonwebtoken";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Get the secret key from environment variables
const secretKey = process.env.SECRET_KEY;


// Function to encode user JWT
export const EncodeUserJwt = (email) => {
  // Payload data to include in the token
  const payload = { email };
  // Options for the token (e.g., expiration time)
  const options = { expiresIn: "5h" }; // Token expires in 1 hour

  // Generate the token
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

// Function to verify user JWT

export const VerifyUserJwt = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token and attach the decoded data to the request object
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach the decoded payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(400).json({ error: "Invalid token." });
  }
};
