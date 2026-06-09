import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT=5000;

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(cors({
    origin:"https://ai-notes-workspace-flax.vercel.app",
    credentials:true
}));

connectDB();

app.use("/api/auth",authRoutes);
app.use("/api",noteRoutes)

app.listen(PORT,()=>{
    console.log("server started on PORT:",PORT)
})