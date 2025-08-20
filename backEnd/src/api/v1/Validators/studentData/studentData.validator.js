// Validator for filterStudentData
import Joi from 'joi';

export const filterStudentDataValidator = Joi.object({
    year: Joi.number().integer().min(1900).max(2100).optional(),
    month: Joi.string().valid(
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ).optional(),
    dateRange: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}$/).optional(),
    paymentMode: Joi.string().valid('online', 'cash').optional(),
});

export const studentDataValidator = Joi.object({
    RegistrationNumber: Joi.string().max(50).required(),
    AdmissionDate: Joi.date().required(),
    StudentName: Joi.string().max(100).required(),
    FatherName: Joi.string().max(100).required(),
    Address: Joi.string().max(255).required(),
    ContactNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    TimeSlots: Joi.array().items(Joi.string()).min(1).required(),
    Shift: Joi.string().max(50).required(),
    SeatNumber: Joi.number().integer().min(0).allow(null),
    FeesPaidTillDate: Joi.date().required(),
    AmountPaid: Joi.number().precision(2).required(),
    AmountDue: Joi.number().precision(2).allow(null),
    LockerNumber: Joi.number().integer().min(0).allow(null),
    PaymentExpectedDate: Joi.date().allow(null),
    PaymentExpectedDateChanged: Joi.number().integer().allow(null),
    PaymentMode: Joi.string().valid('online', 'cash').allow(null, ''),
    AdmissionAmount: Joi.number().precision(2).required(),
    signupId: Joi.string().uuid().allow(null),
});

// For update, all fields are optional, but must match the same types as above
export const updateStudentDataValidator = Joi.object({
    RegistrationNumber: Joi.string().max(50),
    AdmissionDate: Joi.date(),
    StudentName: Joi.string().max(100),
    FatherName: Joi.string().max(100),
    Address: Joi.string().max(255),
    ContactNumber: Joi.string().length(10).pattern(/^[0-9]+$/),
    TimeSlots: Joi.array().items(Joi.string()).min(1),
    Shift: Joi.string().max(50),
    SeatNumber: Joi.number().integer().min(0).allow(null),
    FeesPaidTillDate: Joi.date(),
    AmountPaid: Joi.number().precision(2),
    AmountDue: Joi.number().precision(2).allow(null),
    LockerNumber: Joi.number().integer().min(0).allow(null),
    PaymentExpectedDate: Joi.date().allow(null),
    PaymentExpectedDateChanged: Joi.number().integer().allow(null),
    PaymentMode: Joi.string().valid('online', 'cash').allow(null, ''),
    AdmissionAmount: Joi.number().precision(2),
    signupId: Joi.string().uuid().allow(null),
});
