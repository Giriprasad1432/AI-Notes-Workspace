import { NoteModel } from "../models/Note.js";
import { RegisterModel } from "../models/authModel.js";
import { groq } from "@ai-sdk/groq";
import { generateText } from 'ai';

export const addNote = async (req, res) => {
    try {
        const { title, content } = req.body || {};

        // 🌟 STRICT SAFETY TYPE GAURDS: Catch empty, missing, or invalid fuzzing inputs instantly
        if (title !== undefined && typeof title !== 'string') {
            return res.status(400).json({ success: false, message: "Validation error: title must be a string" });
        }
        if (content !== undefined && typeof content !== 'string') {
            return res.status(400).json({ success: false, message: "Validation error: content must be a string" });
        }

        const cleanTitle = (title || "").trim();
        const cleanContent = (content || "").trim();

        if (!cleanTitle && !cleanContent) {
            return res.status(400).json({ success: false, message: "Validation error: Title or content is required" });
        }

        let userId = null;
        if (req.user && req.user.id) {
            const user = await RegisterModel.findOne({ userId: req.user.id });
            userId = user ? user._id : null;
        }
        
        console.log("addNote called with user:", userId);

        let newTitle = cleanTitle;
        if (!cleanTitle) {
            newTitle = cleanContent.substr(0, 10) + "....";
        }

        const note = new NoteModel({
            title: newTitle,
            content: cleanContent,
            userId
        });
        
        await note.save();
        console.log("Note saved successfully");
        return res.status(200).json({ success: true, message: "Note added successfully" });

    } catch (error) {
        console.log("addNote error:", error);
        res.status(400).json({ success: false, message: "Validation error occurred" });
    }
};

export const getNotes = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized Access" });
        }
        const user = await RegisterModel.findOne({ userId: req.user.id });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        const userId = user._id;
        const Notes = await NoteModel.find({ userId }).sort({ updatedAt: -1 });
        return res.status(200).json({ success: true, data: Notes });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "Error fetching notes" });
    }
};

export const updateNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { title, content } = req.body || {};

        if (title !== undefined && typeof title !== 'string') {
            return res.status(400).json({ success: false, message: "Validation error: title must be a string" });
        }
        if (content !== undefined && typeof content !== 'string') {
            return res.status(400).json({ success: false, message: "Validation error: content must be a string" });
        }

        const cleanTitle = (title || "").trim();
        const cleanContent = (content || "").trim();

        let newTitle = cleanTitle;
        if (!cleanTitle && cleanContent) {
            newTitle = cleanContent.substr(0, 10) + "....";
        }

        const updateNote = await NoteModel.findByIdAndUpdate(noteId, { title: newTitle, content: cleanContent }, { new: true, runValidators: true });
        if (updateNote) {
            return res.status(200).json({ success: true, message: "Note updated successfully", data: updateNote });
        } else {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "Validation error occurred during update" });
    }
};

export const generateSuggestion = async (req, res) => {
    try {
        const { title, content } = req.body || {};
        if (content !== undefined && typeof content !== 'string') {
            return res.status(400).json({ success: false, message: "Validation error: content must be a string" });
        }

        const { text } = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            prompt: `
                You are a Note Completion Assistant.
                Analyze the note carefully and suggest content that naturally continues or completes it.
                Rules:
                - Provide only the suggestion text.
                - Do not explain your reasoning.
                - Do not repeat the original note.
                - Suggestions can be: A short phrase (up to 6 words), or 1–2 concise sentences.
                - mostly try to give sentences.
                - Keep the tone, context, and intent consistent with the note.
                - If title is not empty, include it as context for better suggestions.
                - Return only the most relevant completion.

                Title: ${title || ""}
                Content: ${content || ""}`
        });
        return res.status(200).json({ success: true, suggestion: text });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "Error generating suggestions" });
    }
};
