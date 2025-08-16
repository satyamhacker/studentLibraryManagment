import express from "express"; // Import Express
import cors from "cors"; // Import CORS middleware
import {
  signupCreate,
  login,
  addStudentData,
  fetchStudentsData,
  deleteStudentData,
  updateStudentData,
  updatePaymentExpectedDate,
  exportStudentDataToExcel, // Import the new controller
  sendOtp, verifyOtp, resetPassword,
  filterStudentData // Import the filterStudentData controller
} from "./index.Controller.mjs"; // Import your signupLogin controller

import { VerifyUserJwt } from '../Middleware/Jwt.mjs'; // Import the VerifyUserJwt middleware

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const app = express(); // Create an Express app
const port = process.env.SERVER_PORT; // Port number on which your server will run

app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON requests (no need for bodyParser, it's part of Express)
app.use(express.json());

app.post("/signup", signupCreate); // Route for signup
app.post("/login", login); // Route for login
app.post('/sendOtp', sendOtp);
app.post('/verifyOtp', verifyOtp);
app.post('/resetPassword', resetPassword);

app.post("/addStudent", VerifyUserJwt, addStudentData);

// Route for fetching student data
app.get("/getStudents", VerifyUserJwt, fetchStudentsData);

app.delete("/deleteStudent/:id", VerifyUserJwt, deleteStudentData);

app.put("/updateStudent/:id", VerifyUserJwt, updateStudentData);

app.put("/updatePaymentExpectedDate/:id", VerifyUserJwt, updatePaymentExpectedDate);

app.get("/exportStudents", VerifyUserJwt, exportStudentDataToExcel); // Add the new route

app.post("/filterStudentData", VerifyUserJwt, filterStudentData); // Add the new route for filtering student data

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
