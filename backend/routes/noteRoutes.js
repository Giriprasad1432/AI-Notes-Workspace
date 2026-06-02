import { addNote,getNotes,updateNote} from "../controller/noteController.js";
import express from "express";


const Router=express.Router();

Router.post("/add-note",addNote);
Router.get("/get-notes",getNotes);
Router.put("/update-note/:noteId",updateNote);

export default Router;