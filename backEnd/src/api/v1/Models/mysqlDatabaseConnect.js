
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate environment variables (match .env names)
const requiredEnvVars = ['DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is required but not set`);
  }
});

const sequelize = new Sequelize(
  process.env.DB_DATABASE, // DB_DATABASE instead of DB_NAME
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