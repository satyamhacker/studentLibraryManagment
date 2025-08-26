import { Student } from '../Models/index.model.js';
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { StudentActiveStatus } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: MESSAGE.none });
    }

    await student.update({ StudentActiveStatus });

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.put.succ, data: student });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.error });
  }
};