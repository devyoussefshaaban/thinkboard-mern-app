import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./configs/dbConfig.js";

dotenv.config();
connectDB;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
