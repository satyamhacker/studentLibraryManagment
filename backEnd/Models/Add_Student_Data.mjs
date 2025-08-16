import { sequelize } from './modelsImportExport.mjs';
import { DataTypes } from 'sequelize';

// Define the Student model using the imported sequelize instance
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  RegistrationNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Registration Number is required' },
    },
  },
  AdmissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Admission Date is required' },
      isDate: { msg: 'Admission Date must be a valid date' },
    },
  },
  StudentName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Student Name is required' },
    },
  },
  FatherName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Father Name is required' },
    },
  },
  Address: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Address is required' },
    },
  },
  ContactNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Contact Number is required' },
      len: [10, 10], // Ensures exactly 10 digits
      isNumeric: { msg: 'Contact Number must be numeric' },
    },
  },
  TimeSlots: {
    type: DataTypes.JSON, // Stores array of time slots
    allowNull: false,
    validate: {
      notEmpty: { msg: 'At least one Time Slot is required' },
      isArray(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Time Slots must be a non-empty array');
        }
      },
    },
  },
  Shift: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Shift is required' },
    },
  },
  SeatNumber: {
    type: DataTypes.STRING(20),
    allowNull: true, // Optional field
  },
  FeesPaidTillDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Fees Paid Till Date is required' },
      isDate: { msg: 'Fees Paid Till Date must be a valid date' },
    },
  },
  AmountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Amount Paid is required' },
      isDecimal: { msg: 'Amount Paid must be a valid number' },
    },
  },
  AmountDue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Optional field
  },
  LockerNumber: {
    type: DataTypes.STRING(20),
    allowNull: true, // Optional field
  },
  PaymentExpectedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW, // Default to current date
    validate: {
      notEmpty: { msg: 'Payment Expected Date is required' },
      isDate: { msg: 'Payment Expected Date must be a valid date' },
    },
  },
  PaymentExpectedDateChanged: {
    type: DataTypes.INTEGER,
    allowNull: true,
     // Default to 0
      validate: {
        isInt: { msg: 'Payment Expected Date Changed must be an integer' },
      },
      },
      PaymentMode: {
      type: DataTypes.ENUM('online', 'cash'), // Enum for Payment Mode
      allowNull: true,
      defaultValue: null, // Default to null
      validate: {
        notEmpty: { msg: 'Payment Mode is required' },
      },
      },
  AdmissionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Admission Amount is required' },
      isDecimal: { msg: 'Admission Amount must be a valid number' },
    },
  },
    }, {
      tableName: 'students', // Explicit table name
  timestamps: true, // Adds createdAt and updatedAt fields
  underscored: false, // Use camelCase column names
});

// Optional: Sync the model (uncomment if you want to sync from this file, but better in main app)
// (async () => {
//   await sequelize.sync({ alter: true }); // Use 'alter: true' to update, 'force: true' to recreate (dev only)
//   console.log('Student table synced');
// })();

export default Student;