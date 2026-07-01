import mongoose from 'mongoose';
import { RegisterModel, LoginModel } from './models/authModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = "specmatic-test@example.com";
        const password = "password123";
        let login = await LoginModel.findOne({ email });
        if (!login) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            login = new LoginModel({ email, password: hashedPassword });
            await login.save();
            const register = new RegisterModel({ userId: login._id, name: "Specmatic Test User", email });
            await register.save();
        }
        const token = jwt.sign({ id: login._id }, process.env.JWT_SECRET, { expiresIn: "100y" });
        console.log("=== CREDENTIALS ===");
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("===================");
        console.log("JWT_TOKEN:");
        console.log(token);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();
