import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Note = ({ setRefreshNotes }) => {
    const [note, setNote] = useState({ title: "", content: "" });
    const [isFocus, setFocus] = useState(false);
    const textareaRef = useRef(null);
    const inputRef = useRef(null);
    const [suggestionText, setSuggestionText] = useState("");
    const [isAiActive, setIsAiActive] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!isAiActive) return;

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                const nextSeconds = prevSeconds + 1;
                if(nextSeconds===5){
                    setIsAiActive(true);
                }
                console.log(seconds);
                return nextSeconds;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [note.content]);

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };
    const handleFocus = () => {
        setTimeout(() => {
            if (inputRef.current === document.activeElement || textareaRef.current === document.activeElement) {
                setFocus(true);
            } else {
                setFocus(false);
                // saveNote();
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
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note),
            });
            const data = await response.json();
            console.log("Save response:", data);
            if (data.success) {
                setRefreshNotes(prev => prev + 1);
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
        <div
            className=" dark:border flex min-h-15 justify-center flex-col gap-2 items-center w-[70%] px-3 text-slate-800 dark:text-white bg-white/90 dark:bg-[#212124] border border-slate-200 dark:border-neutral-600 focus-within:border-violet-500/50 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.15)] rounded-2xl transition-[border-color,box-shadow,background-color] duration-300 shadow-sm dark:shadow-none"
            style={{ willChange: "height, transform" }}
        >
            <AnimatePresence>
                {isFocus && (
                    <motion.div
                        key="title-wrapper"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full flex justify-center overflow-hidden"
                    >
                        <input
                            name="title"
                            ref={inputRef}
                            value={note.title}
                            onChange={handleChange}
                            className="py-1 mt-2 text-center text-3xl border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none w-[90%] bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-300"
                            placeholder="Title"
                            type="text"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.textarea
                animate={{ height: isFocus ? "40vh" : "3rem" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                ref={textareaRef}
                onFocus={handleFocus}
                onBlur={handleFocus}
                name="content"
                value={note.content}
                onChange={handleChange}
                className="scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-900/50 scrollbar-thin hover:scrollbar-thumb-violet-300 dark:hover:scrollbar-thumb-violet-700/80 pl-3 pt-3 w-full leading-5 resize-none outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent overflow-y-auto transition-colors duration-300"
                placeholder="Write your Note"
            />
            {/* <div
                onFocus={handleFocus}
                onBlur={handleFocus}
                contentEditable="true"
                value={note.content}
                onInput={(e) => {
                    setNote({ ...note, content: e.target.textContent })
                    setSuggestionText("")
                }}
                suppressContentEditableWarning
                className="scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-900/50 scrollbar-thin hover:scrollbar-thumb-violet-300 dark:hover:scrollbar-thumb-violet-700/80 pl-3 pt-3 w-full leading-5 resize-none outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent overflow-y-auto transition-colors duration-300"
            >
                {note.content}
                <span className="text-slate-400 dark:text-slate-500">{suggestionText}</span>
            </div> */}

            <AnimatePresence>
                {isFocus && (
                    <motion.div
                        key="btn-wrapper"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex justify-end items-end w-full gap-2 overflow-hidden"
                    >
                        <div className="py-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={saveNote}
                                className="bg-violet-600 hover:bg-violet-700 cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200 shadow-md shadow-violet-600/10"
                            >
                                Save
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Note;
