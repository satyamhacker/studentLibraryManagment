import { Student } from '../Models/modelsImportExport.mjs'; // Adjusted path and import
import { Op, fn, literal } from 'sequelize'; // Ensure Op, fn, and literal are imported

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

    // Validate required fields
    if (
      !RegistrationNumber ||
      !AdmissionDate ||
      !StudentName ||
      !FatherName ||
      !Address ||
      !ContactNumber ||
      !TimeSlots || !Array.isArray(TimeSlots) || TimeSlots.length === 0 ||
      !Shift ||
      !FeesPaidTillDate ||
      !AmountPaid ||
      !PaymentMode ||
      !AdmissionAmount
    ) {
      return res.status(400).json({ error: 'All required fields must be provided and TimeSlots must be a non-empty array' });
    }

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
        return res.status(400).json({
          error: 'This Registration Number is already in use.',
          field: 'RegistrationNumber',
        });
      }
      if (existingStudent.ContactNumber === ContactNumber) {
        return res.status(400).json({
          error: 'This Contact Number is already in use.',
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
        return res.status(409).json({
          error: 'This seat is already occupied for one or more of the requested time slots.',
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
        return res.status(409).json({
          error: 'This locker is already assigned to another student.',
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
    res.status(201).json({
      message: 'Student data added successfully',
      data: newStudentData.toJSON(),
    });
  } catch (error) {
    console.error('Error adding student data:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Duplicate entry found', field: error.fields });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};