import mongoose,{ Schema} from "mongoose"

const NoteSchema=new Schema({
        title:{
            type:String
        },
        content:{
            type:String
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },{timestamps:true})

const NoteModel=mongoose.model("Note",NoteSchema);

export {NoteModel};