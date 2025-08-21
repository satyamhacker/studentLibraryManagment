
import { Student } from '../Models/index.model.js'; // Adjust path to your Student model
import { StatusCodes } from 'http-status-codes';
import MESSAGE from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

export const deleteStudentData = async (req, res) => {
  const { id } = req.params;



  try {
    // Find the student by primary key (id)
    const student = await Student.findByPk(id);



    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    // Delete the student
    await student.destroy();

    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: MESSAGE.delete.fail });
  }
};