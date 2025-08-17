import joi from 'joi';

import { SignupValidator, LoginValidator } from './auth/signupLogin.auth.validators.js';

export const validators = {
    auth: {
        SignupValidator: SignupValidator,
        LoginValidator: LoginValidator

    },
}