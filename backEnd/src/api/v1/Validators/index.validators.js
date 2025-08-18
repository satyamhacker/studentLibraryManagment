import joi from 'joi';

import { SignupValidator, LoginValidator } from './auth/signupLogin.auth.validators.js';
import { studentDataValidator, updateStudentDataValidator, filterStudentDataValidator } from './studentData/studentData.validator.js';

export const validators = {
    auth: {
        SignupValidator: SignupValidator,
        LoginValidator: LoginValidator

    },
    studentData: {
        addStudentDataValidator: studentDataValidator,
        updateStudentData: updateStudentDataValidator,
        filterStudentDataValidator: filterStudentDataValidator
    }
}