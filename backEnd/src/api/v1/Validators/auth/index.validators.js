import joi from 'joi';

import { SignupValidator, LoginValidator } from './signupLogin.auth.validators.js';

export const validators = {
    auth: {
        SignupValidator: SignupValidator,
        LoginValidator: LoginValidator

    },
}