
import { Student } from '../Models/index.model.js'; // Adjusted path and import
import { Op, fn, literal } from 'sequelize'; // Ensure Op, fn, and literal are imported
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

export const updatePaymentExpectedDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { PaymentExpectedDate, PaymentExpectedDateChanged } = req.body;

    console.log("testing ", id)

    // Validate required fields
    if (!PaymentExpectedDate || PaymentExpectedDateChanged === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: MESSAGE.put.fail, details: 'PaymentExpectedDate and PaymentExpectedDateChanged must be provided' });
    }

    // Find the student by primary key (id)
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    // Update the student with the request body
    await student.update({ PaymentExpectedDate, PaymentExpectedDateChanged });

    // Respond with the updated student data
    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: student.toJSON(),
    });
  } catch (error) {
    console.error('Error updating student data:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ error: MESSAGE.put.fail, details: errors });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: MESSAGE.error });
  }
};