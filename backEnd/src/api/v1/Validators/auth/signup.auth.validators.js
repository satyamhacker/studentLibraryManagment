import Joi from 'joi';

/**
 * Signup validation schema using Joi
 * Based on the SignupData model requirements
 */
const signupSchema = Joi.object({
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
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
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
});

/**
 * Middleware function to validate signup data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateSignup = (req, res, next) => {
  const { error, value } = signupSchema.validate(req.body, {
    abortEarly: false, // Return all validation errors
    stripUnknown: true // Remove unknown fields
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

// Export schema for direct use if needed
export { signupSchema };