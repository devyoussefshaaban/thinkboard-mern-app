import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./configs/dbConfig.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
