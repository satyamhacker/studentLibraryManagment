import express from "express"; // Import Express
import cors from "cors"; // Import CORS middleware

import dotenv from 'dotenv';

import mainRoutes from "./src/api/v1/Routes/index.routes.js"; // Import main routes
import './src/api/v1/Models/associateModels.models.js'; // Ensure model associations are set up
import { sequelize } from "./src/api/v1/Models/index.model.js"; // adjust path if needed


// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const app = express(); // Create an Express app
const port = process.env.SERVER_PORT; // Port number on which your server will run

app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON requests (no need for bodyParser, it's part of Express)
app.use(express.json());

app.use("/api/v1", mainRoutes);

// Sync all models with the database
sequelize.sync().then(() => {
    console.log("All models were synchronized successfully.");
}).catch((error) => {
    console.error("Error synchronizing models:", error);
});
// sequelize.sync({ alter: true }).then(() => {
//     console.log("All models were synchronized successfully.");
// });
// sequelize.sync({ force: true }).then(() => {
//     console.log("All models were synchronized successfully.");
// });

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
