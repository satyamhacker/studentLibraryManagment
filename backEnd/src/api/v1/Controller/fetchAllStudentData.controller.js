import { Student } from '../Models/index.model.js';
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

// Controller to fetch student data
export const fetchAllStudentData = async (req, res) => {
  try {
    // Fetch all student data from the database
    const students = await Student.findAll();

    // If no students found, return an empty array
    if (!students || students.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.get.empty,
        data: []
      });
    }

    // Send the fetched student data as response
    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: students
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: MESSAGE.error
    });
  }
};