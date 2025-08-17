
import express from "express";

import { addStudentData, deleteStudentData } from "../../Controller/index.controller.js";

import validator from "../../Middleware/validators/validators.middleware.js";
import { validators } from "../../Validators/index.validators.js";
import { VerifyUserJwt } from "../../Middleware/jwt.middleware.js";

const router = express.Router();

router.post("/add-student-data", validator(validators.studentData.addStudentDataValidator), VerifyUserJwt, addStudentData); // Route for signup
router.delete("/delete-student-data/:id", VerifyUserJwt, deleteStudentData); // Route for login


export default router;