import { Student } from '../Models/modelsImportExport.mjs';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportStudentDataToExcel = async (req, res) => {
  try {
    const students = await Student.findAll();

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No student data found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    worksheet.columns = [
      { header: 'Registration Number', key: 'RegistrationNumber', width: 20 },
      { header: 'Admission Date', key: 'AdmissionDate', width: 15 },
      { header: 'Student Name', key: 'StudentName', width: 20 },
      { header: 'Father\'s Name', key: 'FatherName', width: 20 },
      { header: 'Address', key: 'Address', width: 30 },
      { header: 'Contact Number', key: 'ContactNumber', width: 15 },
      { header: 'Time Slots', key: 'TimeSlots', width: 30 },
      { header: 'Shift', key: 'Shift', width: 10 },
      { header: 'Seat Number', key: 'SeatNumber', width: 10 },
      { header: 'Amount Paid', key: 'AmountPaid', width: 15 },
      { header: 'Amount Due', key: 'AmountDue', width: 15 },
      { header: 'Locker Number', key: 'LockerNumber', width: 15 },
      { header: 'Fees Paid Till Date', key: 'FeesPaidTillDate', width: 20 },
      { header: 'Payment Mode', key: 'PaymentMode', width: 15 },
      { header: 'Admission Amount', key: 'AdmissionAmount', width: 15 },
      { header: 'Payment Expected Date', key: 'PaymentExpectedDate', width: 20 }
    ];

    students.forEach(student => {
      const rowData = {
        RegistrationNumber: student.RegistrationNumber,
        AdmissionDate: student.AdmissionDate,
        StudentName: student.StudentName,
        FatherName: student.FatherName,
        Address: student.Address,
        ContactNumber: student.ContactNumber,
        TimeSlots: student.TimeSlots.join(', '),
        Shift: student.Shift,
        SeatNumber: student.SeatNumber,
        AmountPaid: student.AmountPaid,
        AmountDue: student.AmountDue,
        LockerNumber: student.LockerNumber,
        FeesPaidTillDate: student.FeesPaidTillDate,
        PaymentMode: student.PaymentMode,
        AdmissionAmount: student.AdmissionAmount,
      };

      if (student.PaymentExpectedDateChanged > 0 && student.PaymentExpectedDate) {
        rowData.PaymentExpectedDate = student.PaymentExpectedDate;
      }

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
        res.status(500).json({ message: 'Error downloading the file' });
      }
    });
  } catch (error) {
    console.error('Error exporting student data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
