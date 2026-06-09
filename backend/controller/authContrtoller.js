import bcrypt from "bcryptjs"
import {RegisterModel,LoginModel} from "../models/authModel.js";
import jwt from "jsonwebtoken";

const createToken=(res,user)=>{
    try{
        const id=user.id;
        const key=process.env.JWT_SECRET;
        const token=jwt.sign({id},key,{expiresIn:"12h"})
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:12*60*60*1000
        })
    }catch(error){
        console.log(error);
    }
}

export const authController = async (req, res) => {
    const { email, password } = req.body;
    const user = await LoginModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "Invalid username or password!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid username or password!" });
    }
    if(isMatch){
        createToken(res,user);
        res.status(200).json({ success: true, message: "Login successful" });
    }
}

export const RegisterController=async(req,res)=>{
    const {name,email,password}=req.body;
    const user=await LoginModel.findOne({email});
    if(user){
        return res.status(400).json({success:false,message:"User already exist!"})
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newLogin=new LoginModel({
        email,
        password:hashedPassword
    })
    await newLogin.save();
    const newUser=new RegisterModel({
        userId:newLogin._id,
        name,
        email
    })
    await newUser.save();
    res.status(201).json({success:true,message:"User registered successfully"})
}

export const LogoutController = async (req, res) => {
    try {
        res.cookie('token', "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0) 
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}