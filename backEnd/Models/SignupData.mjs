import {sequelize} from './modelsImportExport.mjs'
import { DataTypes } from 'sequelize';

// Define the Signup model using the imported sequelize instance
const SignupData = sequelize.define('SignupData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255), // Adjust length as needed
    allowNull: false,
    unique: true, // Enforces uniqueness at the database level
    validate: {
      notEmpty: { msg: 'Email is required' },
      isEmail: { msg: 'Must be a valid email address' }, // Validates email format
    },
    trim: true, // Sequelize doesn't have built-in trim, handle in app logic if needed
  },
  password: {
    type: DataTypes.STRING(255), // Adjust length based on hashing needs
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' },
    },
  },
}, {
  tableName: 'signup_data', // Explicit table name (snake_case is common in SQL)
  timestamps: true, // Adds createdAt and updatedAt fields
  underscored: false, // Use camelCase column names (set to true for snake_case)
});

// Optional: Sync the model (uncomment if you want to sync from this file, better in main app)
// (async () => {
//   await sequelize.sync({ alter: true }); // Use 'alter: true' to update, 'force: true' to recreate (dev only)
//   console.log('SignupData table synced');
// })();

export default SignupData; // Export the SignupData model for use in other files