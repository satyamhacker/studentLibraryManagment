import joi from 'joi';

import { SignupValidator, LoginValidator } from './auth/signupLogin.auth.validators.js';
import { studentDataValidator } from './studentData/studentData.validator.js';

export const validators = {
    auth: {
        SignupValidator: SignupValidator,
        LoginValidator: LoginValidator

    },
    studentData: {
        addStudentDataValidator: studentDataValidator
    }
}