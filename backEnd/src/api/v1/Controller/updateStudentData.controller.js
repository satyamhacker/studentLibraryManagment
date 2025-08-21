
import { Student } from '../Models/index.model.js'; // Adjust path to your Student model
import { Op, literal } from 'sequelize'; // Ensure Op and literal are imported
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

export const updateStudentData = async (req, res) => {
  const { id } = req.params; // Extract student ID from request parameters
  const updatePayload = req.body; // Extract update data from request body

  try {
    // Find the student by primary key (id)
    const existingStudent = await Student.findByPk(id);

    if (!existingStudent) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: MESSAGE.none });
    }


    // Destructure and exclude specific fields from the update payload
    const { RegistrationNumber, SeatNumber, TimeSlots, LockerNumber, ...filteredUpdatePayload } = updatePayload;

    // Check if SeatNumber and TimeSlots are provided
    if (SeatNumber && TimeSlots && SeatNumber !== "0") {
      // Find conflicting students for the same SeatNumber and overlapping TimeSlots
      const conflictingStudent = await Student.findOne({
        where: {
          SeatNumber,
          [Op.and]: [
            literal(`JSON_OVERLAPS(TimeSlots, '${JSON.stringify(TimeSlots)}')`)
          ],
          id: { [Op.ne]: id } // Exclude the current student being updated
        },
      });

      if (conflictingStudent) {
        // Find free time slots for the seat
        const occupiedTimeSlots = conflictingStudent.TimeSlots;
        const allTimeSlots = [
          "06:00-10:00",
          "10:00-14:00",
          "14:00-18:00",
          "18:00-22:00",
          "22:00-06:00",
          "reserved"
        ];
        const availableTimeSlots = allTimeSlots.filter(slot => !occupiedTimeSlots.includes(slot));

        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          error: MESSAGE.put.fail,
          details: 'This time slot is occupied by another user.',
          occupiedBy: conflictingStudent.StudentName,
          availableTimeSlots
        });
      }

      // Add SeatNumber and TimeSlots to the filtered update payload
      filteredUpdatePayload.SeatNumber = SeatNumber;
      filteredUpdatePayload.TimeSlots = TimeSlots;
    }

    // Check if LockerNumber is provided and not 0
    if (LockerNumber && LockerNumber !== "0") {
      // Find conflicting student for the same LockerNumber
      const conflictingLockerStudent = await Student.findOne({
        where: {
          LockerNumber,
          id: { [Op.ne]: id }
        },
      });

      if (conflictingLockerStudent) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          error: MESSAGE.put.fail,
          details: 'This locker is already occupied by another user.',
          occupiedBy: conflictingLockerStudent.StudentName,
          lockerNumber: LockerNumber
        });
      }
      // Add LockerNumber to the filtered update payload
      filteredUpdatePayload.LockerNumber = LockerNumber;
    }

    // Update the student with the filtered update payload
    await existingStudent.update({
      ...filteredUpdatePayload,
      SeatNumber: SeatNumber || existingStudent.SeatNumber,
      TimeSlots: TimeSlots || existingStudent.TimeSlots
    });

    // Fetch the updated student (optional, Sequelize updates in place)
    const updatedStudent = await Student.findByPk(id);

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.put.succ, data: updatedStudent }); // Send the updated student back
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: MESSAGE.put.fail, details: validationErrors });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.error });
  }
};
