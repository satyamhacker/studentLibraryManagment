import Joi from 'joi';

/**
 * Signup validation schema using Joi
 * This schema is designed to be used with the generic validator middleware.
 */
export const SignupValidator = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'mil', 'int', 'co', 'in', 'uk', 'de', 'fr', 'jp', 'au', 'ca'] }
        })
        .max(255)
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Must be a valid email address',
            'string.max': 'Email must not exceed 255 characters',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .max(255)
        // Require at least one uppercase, one lowercase, one number, and one special character
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must not exceed 255 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
            'any.required': 'Password is required'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Confirm password must match password',
            'any.required': 'Confirm password is required'
        })
})
    // Collect all validation errors at once
    .prefs({ abortEarly: false })
    // Disallow unknown keys to keep payload strict (middleware will return BAD_REQUEST on violation)
    .unknown(false);
