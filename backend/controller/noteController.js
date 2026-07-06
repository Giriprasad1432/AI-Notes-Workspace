import { NoteModel } from "../models/Note.js";
import { RegisterModel } from "../models/authModel.js";
import { groq } from "@ai-sdk/groq"
import { generateText } from 'ai'

export const addNote = async (req, res) => {
    try {
        const { title, content } = req.body || {};

        if ((title !== undefined && typeof title !== 'string') || (content !== undefined && typeof content !== 'string')) {
            return res.status(400).json({ success: false, message: "Validation error: title and content must be strings" });
        }

        let userId = null;
        if (req.user && req.user.id) {
            const user = await RegisterModel.findOne({ userId: req.user.id });
            userId = user ? user._id : null;
        }
        
        console.log("addNote called with user:", userId);
        if (title || content) {
            let newTitle = title;
            if (!title) {
                newTitle = content.substr(0, 10) + "...."
            }
            const note = new NoteModel({
                title: newTitle,
                content,
                userId
            })
            await note.save();
            console.log("Note saved successfully");
            return res.status(200).json({ success:"true", message: "Note added successfully" })
        } else {
            return res.status(400).json({ success: false, message: "Title or content is required" })
        }
    } catch (error) {
        console.log("addNote error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


export const getNotes = async (req, res) => {
    try {
        const user = await RegisterModel.findOne({userId:req.user.id});
        const userId=user._id;
        const Notes = await NoteModel.find({ userId }).sort({ updatedAt: -1 })
        res.status(200).json({ success: true, data: Notes })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const updateNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { title, content } = req.body;

        if ((title !== undefined && typeof title !== 'string') || (content !== undefined && typeof content !== 'string')) {
            return res.status(400).json({ success: false, message: "Validation error: title and content must be strings" });
        }

        let newTitle = title;
        if (!title) {
            newTitle = content.substr(0, 10) + "...."
        }
        const updateNote = await NoteModel.findByIdAndUpdate(noteId, { title: newTitle, content: content }, { new: true, runValidators: true })
        if (updateNote) {
            res.status(200).json({ success: true, message: "Note updated successfully", data: updateNote })
        }
        else {
            res.status(404).json({ success: false, message: "Note not found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}

export const generateSuggestion = async (req, res) => {
    try {
        const { text } = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            prompt: `
                You are a Note Completion Assistant.

                Analyze the note carefully and suggest content that naturally continues or completes it.

                Rules:
                - Provide only the suggestion text.
                - Do not explain your reasoning.
                - Do not repeat the original note.
                - Suggestions can be:
                - A short phrase (up to 6 words), or
                - 1–2 concise sentences.
                - mostly try to give sentences.
                - Keep the tone, context, and intent consistent with the note.
                - If title is not empty, include it as context for better suggestions.
                - Return only the most relevant completion.

                Title:
                ${req.body.title || ""}

                Content:
                ${req.body.content}`});
        res.status(200).json({ success: true, suggestion: text });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}