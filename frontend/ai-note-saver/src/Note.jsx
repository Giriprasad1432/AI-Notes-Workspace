import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import handleAiSuggestion from "./AiSuggestion";
import { vite_api_url } from "./config";
const Note = ({ setRefreshNotes }) => {
    const [note, setNote] = useState({ title: "", content: "" });
    const [isFocus, setFocus] = useState(false);
    const textareaRef = useRef(null);
    const inputRef = useRef(null);
    const suggestionRef = useRef(null);
    const [suggestionText, setSuggestionText] = useState("");
    const [isAiActive, setIsAiActive] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(()=>{
        if(textareaRef.current){
            textareaRef.current.scrollTop=textareaRef.current.scrollHeight;
        }
    },[isFocus]);
    const handleKeyDown = (e)=>{
        if(suggestionText !== ""){
            if(e.key == 'Tab'){
                e.preventDefault();
                setNote({...note,content:note.content+suggestionText})
                setSuggestionText("");
            }
        }
    }

    useEffect(() => {
        if (!isAiActive) return;
        if (!isFocus|| note.content.length===0) {
            setIsAiActive(false);
            return;
        }
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                const nextSeconds = prevSeconds + 1;
                if (nextSeconds === 3) {
                    handleAiSuggestion(note.title,note.content).then((data) => {
                        setSuggestionText(data?.suggestion || "");
                    });
                    setIsAiActive(false);
                }
                return nextSeconds;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isAiActive, isFocus,seconds]);

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
        if (note.content.split(" ").length>=4) {
            setIsAiActive(true);
            setSeconds(0);
            setSuggestionText("");
        }
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
            const response = await fetch(`${vite_api_url}/api/add-note`, {
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
        <motion.div
            initial={{y:10,opacity:0}}
            animate={{y:0,opacity:1}}
            transition={{duration:0.5}}
            className=" dark:border flex min-h-15 justify-center flex-col gap-2 items-center w-[95%] md:w-[70%] px-3 text-slate-800 dark:text-white bg-white/90 dark:bg-[#212124] border border-slate-200 dark:border-neutral-600 focus-within:border-violet-500/50 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.15)] rounded-2xl transition-[border-color,box-shadow,background-color] duration-300 shadow-sm dark:shadow-none"
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

            <motion.div 
                initial={{ height: "3rem" }}
                animate={{ height: isFocus ? "40vh" : "3rem" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative w-full flex flex-col"
            >
                <textarea
                    ref={textareaRef}
                    onFocus={handleFocus}
                    onBlur={handleFocus}
                    name="content"
                    value={note.content}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onScroll={(e) => {
                        if (suggestionRef.current) suggestionRef.current.scrollTop = e.target.scrollTop;
                    }}
                    className="h-full scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-900/50 scrollbar-thin hover:scrollbar-thumb-violet-300 dark:hover:scrollbar-thumb-violet-700/80 p-3 w-full leading-6 resize-none outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent overflow-y-auto transition-colors duration-300 relative z-10 font-sans text-base m-0"
                    placeholder="Write your Note"
                />
                {isFocus && note.content.length>0 && (
                    <div
                        ref={suggestionRef}
                        className="absolute top-0 left-0 p-3 w-full h-full pointer-events-none whitespace-pre-wrap overflow-hidden z-0 font-sans text-base leading-6 m-0"
                        aria-hidden="true"
                    >
                        <span className="text-transparent">{note.content}</span>
                        <span className="text-slate-400 dark:text-slate-500">{suggestionText}</span>
                       {suggestionText?.length>0 && <span className="pl-2 inline-block whitespace-nowrap text-transparent md:text-slate-700 text-xs md:dark:text-slate-400">{"Press [Tab] to accept"}</span>}
                    </div>
                )}
            </motion.div>

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

        </motion.div>
    );
};

export default Note;
