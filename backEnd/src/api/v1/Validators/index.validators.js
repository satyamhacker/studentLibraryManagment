import joi from 'joi';

import { SignupValidator, LoginValidator } from './auth/signupLogin.auth.validators.js';
import { sendOtpValidator, verifyOtpValidator, resetPasswordValidator } from './auth/resetPasswordOtp.auth.validators.js';
import { studentDataValidator, updateStudentDataValidator, filterStudentDataValidator } from './studentData/studentData.validator.js';

export const validators = {
    auth: {
        SignupValidator: SignupValidator,
        LoginValidator: LoginValidator,
        sendOtpValidator: sendOtpValidator,
        verifyOtpValidator: verifyOtpValidator,
        resetPasswordValidator: resetPasswordValidator
    },
    studentData: {
        addStudentDataValidator: studentDataValidator,
        updateStudentData: updateStudentDataValidator,
        filterStudentDataValidator: filterStudentDataValidator
    }
}