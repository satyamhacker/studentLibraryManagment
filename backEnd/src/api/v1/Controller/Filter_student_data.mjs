import { Student } from '../Models/modelsImportExport.mjs'; // Adjust path to your Student model
import { Op } from 'sequelize';

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
        return res.status(400).json({ message: 'Invalid date range' });
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

    res.status(200).json(filteredStudents);
  } catch (error) {
    console.error('Error filtering student data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
