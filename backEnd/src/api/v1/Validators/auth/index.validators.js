import joi from 'joi';

import { SignupValidator } from './signup.auth.validators.js';

export const validators = {
    auth: {
        SignupValidator: SignupValidator
    },
}