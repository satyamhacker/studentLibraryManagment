
import { Student } from '../Models/index.model.js'; // Adjust path to your Student model
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import MESSAGE from '../Constants/index.constants.js';

const convertStringToDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day); // JavaScript Date months are 0-based
};

export const filterStudentData = async (req, res) => {
  const { year, month, dateRange, paymentMode } = req.body;

  try {
    const whereClause = {};

    if (year) {
      whereClause.AdmissionDate = {
        [Op.gte]: new Date(year, 0, 1),
        [Op.lte]: new Date(year, 11, 31),
      };
    }

    if (month) {
      const monthIndex = new Date(`${month} 1, 2000`).getMonth();
      whereClause.AdmissionDate = {
        [Op.gte]: new Date(year || new Date().getFullYear(), monthIndex, 1),
        [Op.lte]: new Date(year || new Date().getFullYear(), monthIndex + 1, 0),
      };
    }

    if (dateRange) {
      const [startDateString, endDateString] = dateRange.split(' - ');
      const startDate = convertStringToDate(startDateString);
      const endDate = convertStringToDate(endDateString);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: MESSAGE.get.fail, details: 'Invalid date range' });
      }
      whereClause.AdmissionDate = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    if (paymentMode) {
      whereClause.PaymentMode = paymentMode;
    }

    const filteredStudents = await Student.findAll({ where: whereClause });

    if (!filteredStudents || filteredStudents.length === 0) {
      return res.status(StatusCodes.OK).json({ message: MESSAGE.get.empty, data: [] });
    }
    res.status(StatusCodes.OK).json({ message: MESSAGE.get.succ, data: filteredStudents });
  } catch (error) {
    console.error('Error filtering student data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: MESSAGE.error });
  }
};
