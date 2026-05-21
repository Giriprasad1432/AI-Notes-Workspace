import mongoose, { Schema } from 'mongoose';

const LoginSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

const RegisterSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"LoginModel"
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
})

const RegisterModel = mongoose.model("User",RegisterSchema);

const LoginModel = mongoose.model("Login", LoginSchema);

export {RegisterModel,LoginModel};