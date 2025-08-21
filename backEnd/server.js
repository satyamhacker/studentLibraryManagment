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

// Serve static frontend from correct dist path
const frontendDistPath = path.join(__dirname, '../frontEnd/dist');
app.use(express.static(frontendDistPath));

// API routes
app.use("/api/v1", mainRoutes);

// Health check endpoint (optional but useful)
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Catch-all route for SPA (non-API routes only)
app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Sync DB models
sequelize.sync()
    .then(() => {
        console.log("✅ All models synchronized successfully.");
    })
    .catch((error) => {
        console.error("❌ Error synchronizing models:", error);
    });

// Start server — bind to 0.0.0.0 for NGINX compatibility
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is listening on port ${port}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    console.log(`📦 Serving frontend from: ${frontendDistPath}`);
});