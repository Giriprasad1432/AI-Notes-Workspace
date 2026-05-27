import {NoteModel} from "../models/Note.js";

export const addNote=async(req,res)=>{
    try{
        const {title,content}=req.body;
        console.log("addNote called:", {title, content});
        if(title||content){
            let newTitle=title;
            if(!title){
                newTitle=content.substr(0,10)+"...."
            }
            const note=new NoteModel({
                title:newTitle,
                content
            })
            await note.save();
            console.log("Note saved successfully");
            return res.status(200).json({success:true,message:"Note added successfully"})
        }else{
            return res.status(400).json({success:false,message:"Title or content is required"})
        }
    }catch(error){
        console.log("addNote error:",error);
        res.status(500).json({success:false,message:"Internal server error"})
    }
}

export const getNotes=async(req,res)=>{
    try{
        const Notes=await NoteModel.find({}).sort({createdAt:-1})
        res.status(200).json({success:true,data:Notes})
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}