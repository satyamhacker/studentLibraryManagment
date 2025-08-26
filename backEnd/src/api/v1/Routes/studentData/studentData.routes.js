
import express from "express";

import { addStudentData, deleteStudentData, fetchAllStudentData, updatePaymentExpectedDate, filterStudentData, exportStudentDataToExcel, updateStudentStatus } from "../../Controller/index.controller.js";

import validator from "../../Middleware/validators/validators.middleware.js";
import { validators } from "../../Validators/index.validators.js";
import { VerifyUserJwt } from "../../Middleware/jwt.middleware.js";
import { updateStudentData } from "../../Controller/updateStudentData.controller.js";

const router = express.Router();

router.post("/add-student-data", validator(validators.studentData.addStudentDataValidator), VerifyUserJwt, addStudentData); // Route for signup
router.post("/filter-student-data", validator(validators.studentData.filterStudentDataValidator), VerifyUserJwt, filterStudentData);
router.delete("/delete-student-data/:id", VerifyUserJwt, deleteStudentData); // Route for login
router.get("/fetch-all-student-data", VerifyUserJwt, fetchAllStudentData);
router.patch("/update-student-data/:id", VerifyUserJwt, validator(validators.studentData.updateStudentData), updateStudentData);
router.patch("/update-payment-expected-date/:id", VerifyUserJwt, updatePaymentExpectedDate);
router.patch("/update-student-status/:id", VerifyUserJwt, updateStudentStatus);

// Route to export student data to Excel
router.get("/export-student-data-excel", VerifyUserJwt, exportStudentDataToExcel);
export default router;