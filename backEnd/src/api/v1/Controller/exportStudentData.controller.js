
import { StatusCodes } from 'http-status-codes';
import constants from '../Constants/index.constants.js';
import Student from '../Models/studentData.model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import ExcelJS from 'exceljs';
const MESSAGE = constants.MESSAGE;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportStudentDataToExcel = async (req, res) => {
  try {
    const students = await Student.findAll();

    if (!students || students.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'Registration Number', key: 'RegistrationNumber', width: 20 },
      { header: 'Admission Date', key: 'AdmissionDate', width: 15 },
      { header: 'Student Name', key: 'StudentName', width: 20 },
      { header: 'Father\'s Name', key: 'FatherName', width: 20 },
      { header: 'Address', key: 'Address', width: 30 },
      { header: 'Contact Number', key: 'ContactNumber', width: 15 },
      { header: 'Time Slots', key: 'TimeSlots', width: 30 },
      { header: 'Shift', key: 'Shift', width: 10 },
      { header: 'Seat Number', key: 'SeatNumber', width: 10 },
      { header: 'Fees Paid Till Date', key: 'FeesPaidTillDate', width: 20 },
      { header: 'Amount Paid', key: 'AmountPaid', width: 15 },
      { header: 'Amount Due', key: 'AmountDue', width: 15 },
      { header: 'Locker Number', key: 'LockerNumber', width: 15 },
      { header: 'Payment Expected Date', key: 'PaymentExpectedDate', width: 20 },
      { header: 'Payment Expected Date Changed', key: 'PaymentExpectedDateChanged', width: 25 },
      { header: 'Payment Mode', key: 'PaymentMode', width: 15 },
      { header: 'Admission Amount', key: 'AdmissionAmount', width: 15 },
      { header: 'Signup ID', key: 'signupId', width: 40 },
      { header: 'Student Active Status', key: 'StudentActiveStatus', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    students.forEach(student => {
      const rowData = {
        id: student.id,
        RegistrationNumber: student.RegistrationNumber,
        AdmissionDate: student.AdmissionDate,
        StudentName: student.StudentName,
        FatherName: student.FatherName,
        Address: student.Address,
        ContactNumber: student.ContactNumber,
        TimeSlots: Array.isArray(student.TimeSlots) ? student.TimeSlots.join(', ') : student.TimeSlots,
        Shift: student.Shift,
        SeatNumber: student.SeatNumber,
        FeesPaidTillDate: student.FeesPaidTillDate,
        AmountPaid: student.AmountPaid,
        AmountDue: student.AmountDue,
        LockerNumber: student.LockerNumber,
        PaymentExpectedDate: student.PaymentExpectedDate,
        PaymentExpectedDateChanged: student.PaymentExpectedDateChanged,
        PaymentMode: student.PaymentMode,
        AdmissionAmount: student.AdmissionAmount,
        signupId: student.signupId,
        StudentActiveStatus: student.StudentActiveStatus ? 'Active' : 'Inactive',
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      };

      worksheet.addRow(rowData);
    });

    const exportDir = path.join(__dirname, '..', 'exportsStudentData');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const filePath = path.join(exportDir, 'students_data.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'students_data.xlsx', (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGE.get.custom('Error downloading the file')
        });
      }
      // Optionally, you can log or send a message on successful download trigger
      // But download() does not send a JSON response on success
    });
  } catch (error) {
    console.error('Error exporting student data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.custom('Internal server error while exporting student data')
    });
  }
};
