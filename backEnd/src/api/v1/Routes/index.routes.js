import express from "express";
import authRoutes from "./auth/auth.routes.js";

import studentDataRoutes from "./studentData/studentData.routes.js"

const app = express();

app.use("/auth", authRoutes);
app.use("/student-data", studentDataRoutes)



export default app;


