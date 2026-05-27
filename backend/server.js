import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from "cors";

const app = express();
const PORT=5000;

app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/auth",authRoutes);
app.use("/api",noteRoutes)

app.listen(PORT,()=>{
    console.log("server started on PORT:",PORT)
})