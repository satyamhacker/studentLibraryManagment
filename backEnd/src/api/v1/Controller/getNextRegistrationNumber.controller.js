import { Student } from "../Models/index.model.js";
import { StatusCodes } from "http-status-codes";
import constants from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

export const getNextRegistrationNumber = async (req, res) => {
  try {
    // Get all registration numbers, sorted in ascending order
    const students = await Student.findAll({
      attributes: ['RegistrationNumber'],
      order: [['RegistrationNumber', 'ASC']]
    });

    const registrationNumbers = students.map(student => parseInt(student.RegistrationNumber)).filter(num => !isNaN(num));

    // If no students exist, start with 1
    if (registrationNumbers.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.get.succ,
        data: { nextRegistrationNumber: 1 }
      });
    }

    // Find the first available number
    let nextNumber = 1;
    const registrationSet = new Set(registrationNumbers);
    
    while (registrationSet.has(nextNumber)) {
      nextNumber++;
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: { nextRegistrationNumber: nextNumber }
    });

  } catch (error) {
    console.error("Error fetching next registration number:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message
    });
  }
};