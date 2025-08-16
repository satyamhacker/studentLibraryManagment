import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Log environment variables for debugging
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_USERNAME:', process.env.DB_USERNAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);

// Validate environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is required but not set`);
  }
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 15000,
    },
  }
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the MySQL database');
    
    // Sync all models to create tables if they don’t exist
    // await sequelize.sync({ alter: true }); // Use 'alter: true' to update existing tables, 'force: true' to recreate (dev only)
    console.log('Database tables synced');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

connectToDatabase();

export default sequelize;