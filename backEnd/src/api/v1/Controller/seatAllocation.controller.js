import { Student } from '../Models/index.model.js';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
const MESSAGE = constants.MESSAGE;

export const getAllSeatAllocationData = async (req, res) => {
    try {
        // Get maximum seat number from database
        const maxSeatResult = await Student.findOne({
            attributes: [[Student.sequelize.fn('MAX', Student.sequelize.col('SeatNumber')), 'maxSeat']],
            raw: true
        });
        
        const totalSeats = Math.max(maxSeatResult?.maxSeat || 0, 136); // Default to 136 if no seats found
        const seatNumbers = [];

        // Get all allocated seat numbers
        const allocatedSeats = await Student.findAll({
            attributes: ['SeatNumber'],
            where: {
                SeatNumber: { [Op.ne]: 0 }
            }
        });

        const allocatedSeatNumbers = allocatedSeats.map(student => student.SeatNumber);

        // Generate seat allocation data
        for (let i = 1; i <= totalSeats; i++) {
            seatNumbers.push({
                seatNumber: i,
                isAllocated: allocatedSeatNumbers.includes(i),
                student: allocatedSeatNumbers.includes(i) ?
                    await Student.findOne({ where: { SeatNumber: i } }) : null
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: MESSAGE.get.succ,
            data: seatNumbers,
            totalSeats,
            allocatedSeats: allocatedSeatNumbers.length,
            availableSeats: totalSeats - allocatedSeatNumbers.length
        });
    } catch (error) {
        console.error('Error fetching seat allocation:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: MESSAGE.error
        });
    }
};