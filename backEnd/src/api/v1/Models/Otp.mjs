import { sequelize } from './modelsImportExport.mjs';
import { DataTypes } from 'sequelize';

// Define the Otp model using the imported sequelize instance
const Otp = sequelize.define('Otp', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Email is required' },
      isEmail: { msg: 'Must be a valid email address' },
    },
  },
  otp: {
    type: DataTypes.STRING(4), // Adjust length as needed
    allowNull: false,
    validate: {
      notEmpty: { msg: 'OTP is required' },
    },
  },
}, {
  tableName: 'otps', // Explicit table name
  timestamps: true, // Adds createdAt and updatedAt fields
  underscored: false, // Use camelCase column names
});

export default Otp;