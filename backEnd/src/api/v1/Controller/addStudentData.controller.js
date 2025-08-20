
import { Student } from '../Models/index.model.js'; // Adjusted path and import
import { Op, fn, literal } from 'sequelize'; // Ensure Op, fn, and literal are imported
import { StatusCodes } from 'http-status-codes';
import MESSAGE from '../Constants/message.js';

export const addStudentData = async (req, res) => {
  try {
    const {
      RegistrationNumber,
      AdmissionDate,
      StudentName,
      FatherName,
      Address,
      ContactNumber,
      TimeSlots,
      Shift,
      SeatNumber,
      FeesPaidTillDate,
      AmountPaid,
      AmountDue,
      LockerNumber,
      PaymentMode,
      AdmissionAmount,
    } = req.body;

    // Validation is now handled by middleware (Joi validator)

    // Check if RegistrationNumber or ContactNumber already exists
    const existingStudent = await Student.findOne({
      where: {
        [Op.or]: [
          { RegistrationNumber },
          { ContactNumber },
        ],
      },
    });

    if (existingStudent) {
      if (existingStudent.RegistrationNumber === RegistrationNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: MESSAGE.post.sameEntry,
          field: 'RegistrationNumber',
        });
      }
      if (existingStudent.ContactNumber === ContactNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: MESSAGE.post.sameEntry,
          field: 'ContactNumber',
        });
      }
    }

    // Sanitize SeatNumber and LockerNumber for integer logic
    let seatNum = SeatNumber;
    if (seatNum === "" || seatNum === undefined || seatNum === null) seatNum = 0;
    let lockerNum = LockerNumber;
    if (lockerNum === "" || lockerNum === undefined || lockerNum === null) lockerNum = 0;

    // Check for seat and time slot conflict only if seatNum is not 0
    let conflictingStudent = null;
    if (seatNum !== 0) {
      conflictingStudent = await Student.findOne({
        where: {
          SeatNumber: seatNum, // Match the exact seat number
          [Op.and]: [
            literal(`JSON_OVERLAPS(TimeSlots, '${JSON.stringify(TimeSlots)}')`)
          ],
        },
      });

      if (conflictingStudent) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          error: MESSAGE.post.fail,
          details: 'This seat is already occupied for one or more of the requested time slots.',
          conflictingStudent: conflictingStudent.toJSON(),
        });
      }
    }

    // Check if lockerNum is already assigned to another student (but skip if 0)
    if (lockerNum !== 0) {
      const existingLocker = await Student.findOne({
        where: {
          LockerNumber: lockerNum,
        },
      });

      if (existingLocker) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          error: MESSAGE.post.fail,
          details: 'This locker is already assigned to another student.',
          assignedTo: existingLocker.StudentName,
        });
      }
    }

    // Create a new student record in the database
    const newStudentData = await Student.create({
      RegistrationNumber,
      AdmissionDate,
      StudentName,
      FatherName,
      Address,
      ContactNumber,
      TimeSlots, // Already an array from the frontend
      Shift,
      SeatNumber,
      FeesPaidTillDate,
      AmountPaid: parseFloat(AmountPaid),
      AmountDue: AmountDue ? parseFloat(AmountDue) : null,
      LockerNumber,
      PaymentMode,
      AdmissionAmount: parseFloat(AdmissionAmount),
      signupId: req.user.userId, // Set the foreign key from JWT
    });

    // Respond with the newly created student data
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: newStudentData.toJSON(),
    });
  } catch (error) {
    console.error('Error adding student data:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: MESSAGE.post.fail,
        details: errors
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      const fieldName = Object.keys(error.fields)[0];
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: MESSAGE.post.sameEntry,
        field: fieldName
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: MESSAGE.error
    });
  }
};