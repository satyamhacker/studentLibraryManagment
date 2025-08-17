import Joi from 'joi';

export const studentDataValidator = Joi.object({
    RegistrationNumber: Joi.string().max(50).required(),
    AdmissionDate: Joi.date().required(),
    StudentName: Joi.string().max(100).required(),
    FatherName: Joi.string().max(100).required(),
    Address: Joi.string().max(255).required(),
    ContactNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    TimeSlots: Joi.array().items(Joi.string()).min(1).required(),
    Shift: Joi.string().max(50).required(),
    SeatNumber: Joi.string().max(20).allow(null, ''),
    FeesPaidTillDate: Joi.date().required(),
    AmountPaid: Joi.number().precision(2).required(),
    AmountDue: Joi.number().precision(2).allow(null),
    LockerNumber: Joi.string().max(20).allow(null, ''),
    PaymentExpectedDate: Joi.date().allow(null),
    PaymentExpectedDateChanged: Joi.number().integer().allow(null),
    PaymentMode: Joi.string().valid('online', 'cash').allow(null, ''),
    AdmissionAmount: Joi.number().precision(2).required(),
    signupId: Joi.string().uuid().allow(null),
});
