import { addNote,getNotes } from "../controller/noteController.js";
import express from "express";


const Router=express.Router();

Router.post("/add-note",addNote);
Router.get("/get-notes",getNotes);

export default Router;