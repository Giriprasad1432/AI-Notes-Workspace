import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Note = ({ setRefreshNotes }) => {
    const [note, setNote] = useState({ title: "", content: "" });
    const [isFocus, setFocus] = useState(false);
    const textareaRef = useRef(null);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [note.content]);

    const handleFocus = () => {
        setTimeout(() => {
            if (inputRef.current === document.activeElement || textareaRef.current === document.activeElement) {
                setFocus(true);
            } else {
                setFocus(false);
                saveNote();
            }
        }, 0);
    };

    const saveNote = async () => {
        if (!note.title && !note.content) {
            console.log("both shouldnt be empty");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/add-note", {
                method: "POST",
                credentials:"include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note),
            });
            const data = await response.json();
            console.log("Save response:", data);
            if (data.success) {
                setRefreshNotes(prev=>prev+1);
                setNote({ title: "", content: "" });
                setFocus(false);
            } else {
                console.warn("Note not saved:", data.message);
            }
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    return (
        <motion.div
            layout
            transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
            className="flex flex-col gap-2 items-center w-[70%] px-3 pt-2 text-slate-800 dark:text-white bg-white/90 dark:bg-[#212124]/70 border border-slate-200 dark:border-transparent focus-within:border-violet-500/50 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.15)] rounded-2xl transition-[border-color,box-shadow,background-color] duration-300 shadow-sm dark:shadow-none"
            style={{ willChange: "height, transform" }}
        >
            <AnimatePresence>
                {isFocus && (
                    <motion.input
                        key="title-input"
                        initial={{ opacity: 0, scaleY: 0.6, originY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.6, originY: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        name="title"
                        ref={inputRef}
                        value={note.title}
                        onChange={handleChange}
                        className="py-1 text-center text-3xl border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none w-[90%] bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-300"
                        placeholder="Title"
                        type="text"
                    />
                )}
            </AnimatePresence>

            <textarea
                ref={textareaRef}
                onFocus={handleFocus}
                onBlur={handleFocus}
                name="content"
                value={note.content}
                onChange={handleChange}
                rows={1}
                className="scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-900/50 scrollbar-thin hover:scrollbar-thumb-violet-300 dark:hover:scrollbar-thumb-violet-700/80 pl-3 pt-3 w-full leading-5 resize-none outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent overflow-y-auto max-h-[30vh] transition-colors duration-300"
                placeholder="Write your Note"
            />

            <div className="flex justify-end items-end w-full gap-2 py-2">
                <AnimatePresence>
                    {isFocus && (
                        <motion.button
                            key="save-btn"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={saveNote}
                            className="bg-violet-600 hover:bg-violet-700 cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200 shadow-md shadow-violet-600/10"
                        >
                            Save
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Note;
