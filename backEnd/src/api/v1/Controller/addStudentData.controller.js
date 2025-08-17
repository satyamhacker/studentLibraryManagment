
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
          error: MESSAGE.post.sameEntry,
          field: 'RegistrationNumber',
        });
      }
      if (existingStudent.ContactNumber === ContactNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: MESSAGE.post.sameEntry,
          field: 'ContactNumber',
        });
      }
    }

    // Check for seat and time slot conflict only if SeatNumber is not "0"
    let conflictingStudent = null;
    if (SeatNumber !== "0") {
      conflictingStudent = await Student.findOne({
        where: {
          SeatNumber, // Match the exact seat number
          [Op.and]: [
            literal(`JSON_OVERLAPS(TimeSlots, '${JSON.stringify(TimeSlots)}')`) // Check for overlapping time slots
          ],
        },
      });


      if (conflictingStudent) {
        return res.status(StatusCodes.CONFLICT).json({
          error: MESSAGE.post.fail,
          details: 'This seat is already occupied for one or more of the requested time slots.',
          conflictingStudent: conflictingStudent.toJSON(),
        });
      }
    }

    // Check if LockerNumber is already assigned to another student
    if (LockerNumber) {
      const existingLocker = await Student.findOne({
        where: {
          LockerNumber,
        },
      });

      if (existingLocker) {
        return res.status(StatusCodes.CONFLICT).json({
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
    });

    // Respond with the newly created student data
    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newStudentData.toJSON(),
    });
  } catch (error) {
    console.error('Error adding student data:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: MESSAGE.post.fail, details: errors });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: MESSAGE.post.sameEntry, field: error.fields });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: MESSAGE.error });
  }
};