import Joi from 'joi';

export const sendOtpValidator = Joi.object({
    email: Joi.string().email().required(),
});

export const verifyOtpValidator = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).pattern(/^[0-9]{4}$/).required(),
});

export const resetPasswordValidator = Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required(),
});
