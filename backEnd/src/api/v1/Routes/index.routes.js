import express from "express";
import authRoutes from "./auth/auth.routes.js";

const app = express();

app.use("/auth", authRoutes);
app.use("/reset-password", authRoutes)


export default app;


