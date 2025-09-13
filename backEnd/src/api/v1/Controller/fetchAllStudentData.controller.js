import { Student } from '../Models/index.model.js';
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination.js';
const MESSAGE = constants.MESSAGE;

// Controller to fetch student data
export const fetchAllStudentData = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    
    // Fetch paginated student data and total count
    const { count, rows: students } = await Student.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // If no students found, return empty response with pagination
    if (!students || students.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.get.empty,
        ...createPaginationResponse([], count, page, limit)
      });
    }

    // Send paginated response
    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      ...createPaginationResponse(students, count, page, limit)
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: MESSAGE.error
    });
  }
};