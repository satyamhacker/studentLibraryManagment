import joi from 'joi';

import { SignupValidator } from './signup.auth.validators';

export const validators = {
    auth: {
        SignupValidator: SignupValidator
    },
}