import { Student } from '../Models/modelsImportExport.mjs'; // Adjusted path and import
import { Op, fn, literal } from 'sequelize'; // Ensure Op, fn, and literal are imported

export const updatePaymentExpectedDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { PaymentExpectedDate, PaymentExpectedDateChanged } = req.body;

    // Validate required fields
    if (!PaymentExpectedDate || PaymentExpectedDateChanged === undefined) {
      return res.status(400).json({ error: 'PaymentExpectedDate and PaymentExpectedDateChanged must be provided' });
    }

    // Find the student by primary key (id)
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the student with the request body
    await student.update({ PaymentExpectedDate, PaymentExpectedDateChanged });

    // Respond with the updated student data
    res.status(200).json({
      message: 'Student data updated successfully',
      data: student.toJSON(),
    });
  } catch (error) {
    console.error('Error updating student data:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};