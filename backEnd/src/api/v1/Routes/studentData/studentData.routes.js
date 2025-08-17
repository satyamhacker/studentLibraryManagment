
import express from "express";

import { addStudentData } from "../../Controller/index.controller.js";

import validator from "../../Middleware/validators/validators.middleware.js";
import { validators } from "../../Validators/index.validators.js";
import { VerifyUserJwt } from "../../Middleware/jwt.middleware.js";

const router = express.Router();

router.post("/add-student-data", validator(validators.studentData.addStudentDataValidator), addStudentData); // Route for signup


export default router;