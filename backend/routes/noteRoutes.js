import { addNote,getNotes,updateNote,generateSuggestion} from "../controller/noteController.js";
import express from "express";
import {protect} from "../middleware/authMiddleWare.js";

const Router=express.Router();

Router.post("/add-note",protect,addNote);
Router.get("/get-notes",protect,getNotes);
Router.put("/update-note/:noteId",protect,updateNote);
Router.post("/suggestion",protect,generateSuggestion);

export default Router;