import express from "express";
import authRoutes from "./auth/auth.routes.js";

const app = express();

app.use("/auth", authRoutes);


export default app;


// import {
//     signupCreate,
//     login,
//     addStudentData,
//     fetchStudentsData,
//     deleteStudentData,
//     updateStudentData,
//     updatePaymentExpectedDate,
//     exportStudentDataToExcel, // Import the new controller
//     sendOtp, verifyOtp, resetPassword,
//     filterStudentData // Import the filterStudentData controller
// } from "./index.Controller.mjs"; // Import your signupLogin controller

// import { VerifyUserJwt } from '../Middleware/Jwt.mjs'; // Import the VerifyUserJwt middleware

// app.post("/signup", signupCreate); // Route for signup
// app.post("/login", login); // Route for login
// app.post('/sendOtp', sendOtp);
// app.post('/verifyOtp', verifyOtp);
// app.post('/resetPassword', resetPassword);

// app.post("/addStudent", VerifyUserJwt, addStudentData);

// // Route for fetching student data
// app.get("/getStudents", VerifyUserJwt, fetchStudentsData);

// app.delete("/deleteStudent/:id", VerifyUserJwt, deleteStudentData);

// app.put("/updateStudent/:id", VerifyUserJwt, updateStudentData);

// app.put("/updatePaymentExpectedDate/:id", VerifyUserJwt, updatePaymentExpectedDate);

// app.get("/exportStudents", VerifyUserJwt, exportStudentDataToExcel); // Add the new route

// app.post("/filterStudentData", VerifyUserJwt, filterStudentData); // Add the new route for filtering student data