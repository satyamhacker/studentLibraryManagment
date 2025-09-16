import { Student } from '../Models/index.model.js';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

export const getLockerAllocationData = async (req, res) => {
    try {
        // Get maximum locker number from database
        const maxLockerResult = await Student.findOne({
            attributes: [[Student.sequelize.fn('MAX', Student.sequelize.col('LockerNumber')), 'maxLocker']],
            raw: true
        });
        
        const totalLockers = Math.max(maxLockerResult?.maxLocker || 0, 100); // Default to 100 if no lockers found

        // Get all students with allocated lockers
        const studentsWithLockers = await Student.findAll({
            where: {
                LockerNumber: { [Op.ne]: 0 }
            }
        });

        res.status(StatusCodes.OK).json({
            success: true,
            message: MESSAGE.get.succ,
            data: studentsWithLockers,
            totalLockers,
            allocatedLockers: studentsWithLockers.length,
            availableLockers: totalLockers - studentsWithLockers.length
        });
    } catch (error) {
        console.error('Error fetching locker allocation:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: MESSAGE.error
        });
    }
};