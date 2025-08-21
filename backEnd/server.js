import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import mainRoutes from "./src/api/v1/Routes/index.routes.js";
import "./src/api/v1/Models/associateModels.models.js";
import { sequelize } from "./src/api/v1/Models/index.model.js";

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.SERVER_PORT || 3100;

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Serve static frontend from dist
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use("/api/v1", mainRoutes);

// Catch-all route for SPA (React/Vue)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Sync DB models
sequelize.sync()
    .then(() => {
        console.log("✅ All models synchronized successfully.");
    })
    .catch((error) => {
        console.error("❌ Error synchronizing models:", error);
    });

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is listening on port ${port}`);
});