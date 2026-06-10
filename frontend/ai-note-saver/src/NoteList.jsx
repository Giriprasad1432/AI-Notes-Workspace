import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import handleAiSuggestion from "./AiSuggestion";
import { vite_api_url } from "./config";
import { useUI } from "./UIContext";

const layoutTiming = {
    type: "spring",
    duration: 0.6,
    bounce: 0.15,
    ease: "easeOut",
};


const NoteList = ({ selectedNote, onSelectNote, refreshNotes }) => {
    const [notes, setNotes] = useState([]);
    const suggestionRef1 = useRef(null);
    const updateRef = useRef(null);
    const notelistRef = useRef(null);
    const [suggestionText, setSuggestionText] = useState("");
    const [isAiActive, setIsAiActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const { isMobile } = useUI();

    useEffect(() => {
        if (updateRef.current) {
            updateRef.current.scrollTop = updateRef.current.scrollHeight;
        }

    }, [selectedNote, suggestionText])

    const handleKeyDown = (e) => {
        if (suggestionText !== "") {
            if (!isMobile && e.key == 'Tab') {
                e.preventDefault();
                setNotes(prevNotes => prevNotes.map(note =>
                    note._id === selectedNote._id
                        ? { ...note, content: note.content + suggestionText }
                        : note
                ));
                setSuggestionText("");
            }
            if (isMobile && e.key === 'Enter') {
                e.preventDefault();
                acceptSuggestion();
            }
        }
    }

    const acceptSuggestion = () => {
        setNotes(prevNotes => prevNotes.map(note =>
            note._id === selectedNote._id
                ? { ...note, content: note.content + suggestionText }
                : note
        ));
        setSuggestionText("");
    }

    useEffect(() => {
        if (!isAiActive) return;
        if (!selectedNote?.content || selectedNote.content.length === 0) {
            setIsAiActive(false);
            return;
        }
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                const nextSeconds = prevSeconds + 1;
                if (nextSeconds === 3) {
                    handleAiSuggestion(selectedNote.title, selectedNote.content).then((data) => {
                        setSuggestionText(data?.suggestion || "");
                    });
                    setIsAiActive(false);
                }
                return nextSeconds;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isAiActive, seconds]);


    const handleChange = (id, e) => {
        setNotes(prevNotes => prevNotes.map(prevNote =>
            prevNote._id === id ? { ...prevNote, [e.target.name]: e.target.value } : prevNote
        ));
        if (e.target.name === "content" && e.target.value.split(" ").length >= 4) {
            setSuggestionText("");
            setIsAiActive(true);
            setSeconds(0);
        }
    }
    const handleUpdate = (note) => {
        if (selectedNote.title !== note.title || selectedNote.content !== note.content) {
            updateNote(note);
            onSelectNote({ title: "", content: "" });
            getNotes();
        } else {
            console.log("No change in note!");
            onSelectNote({ title: "", content: "" });
        }
    }

    const updateNote = async (note) => {
        const response = await fetch(`${vite_api_url}/api/update-note/${note._id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(note),
        });
        return await response.json();
    }

    const getNotes = async () => {
        try {
            const response = await fetch(`${vite_api_url}/api/get-notes`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", }
            });
            const data = await response.json();
            if (data.success) setNotes(data.data.slice(0, 7).reverse());
        } catch (error) {
            console.error("Get notes failed:", error);
        }
    }

    useEffect(() => {
        getNotes();
        if (notelistRef.current) {
            notelistRef.current.scrollLeft = notelistRef.current.scrollWidth;
        }
    }, [refreshNotes]);

    return (
        <>
            <div ref={notelistRef} className="w-fit max-w-[calc(100vw-1rem)] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-row-reverse gap-2 px-2 pb-2 bottom-5 mt-3 md:bottom-10 right-2 sm:right-10 fixed z-[40] select-none">
                {notes.map((note) => {
                    const isSelected = selectedNote._id === note._id;
                    return (
                        <div
                            key={note._id}
                            className="h-30 md:h-30 w-36 md:w-50 relative shrink-0"
                            style={{ contain: "layout size" }}
                        >
                            {!isSelected && (
                                <motion.div
                                    layoutId={`note-${note._id}`}
                                    transition={{ duration: 1.5, layout: layoutTiming }}
                                    initial={{
                                        opacity: 0
                                    }}
                                    animate={{
                                        opacity: 1
                                    }}
                                    style={{ willChange: "transform" }}
                                    className="absolute inset-0 cursor-pointer border border-slate-200 dark:border-transparent hover:border-blue-500/70 dark:hover:border-blue-700/70 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 bg-white/90 dark:bg-[#212124]/70 rounded-md overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300"
                                    onClick={() => onSelectNote(note)}
                                >
                                    <motion.div
                                        className="h-full w-full flex flex-col justify-center p-3 overflow-hidden"
                                        whileHover={{ scale: 1.04 }}
                                        transition={{ type: "tween", duration: 0.14 }}
                                    >
                                        <h1 className="font-bold text-xl text-slate-800 dark:text-slate-100 text-center transition-colors duration-300 truncate w-full px-1">{note.title}</h1>
                                        <p className="line-clamp-3 text-slate-600 dark:text-slate-300 text-xs px-2 mt-1 text-center transition-colors duration-300 break-words">{note.content}</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {notes.map((note) => (
                    selectedNote._id === note._id && (
                        <div key={`modal-${note._id}`}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => handleUpdate(note)}
                                className="fixed z-[60] top-0 left-0 w-full h-full bg-black/20 dark:bg-black/40 backdrop-blur-xs"
                            />

                            <motion.div
                                layoutId={`note-${note._id}`}
                                transition={{ layout: layoutTiming }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                                    translate: "-50% -50%",
                                    willChange: "transform"
                                }}
                                className="flex flex-col rounded-2xl w-[92%] max-w-[600px] h-[65vh] sm:h-[400px] z-[70] border bg-white dark:bg-[#212124] shadow-2xl border-slate-200 dark:border-[#222222] overflow-hidden scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-900/50 scrollbar-thin hover:scrollbar-thumb-violet-300 dark:hover:scrollbar-thumb-violet-800/80 transition-colors duration-300"
                            >
                                <input
                                    placeholder="Title"
                                    name="title"
                                    value={note.title}
                                    onChange={(e) => handleChange(note._id, e)}
                                    className="outline-none text-center text-2xl py-4 text-slate-800 dark:text-slate-200 font-semibold bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-300"
                                />
                                <div className="border-b border-slate-100 dark:border-violet-950/50 transition-colors duration-300"></div>
                                <div className="relative w-full h-full">
                                    <textarea
                                        placeholder="Enter Content"
                                        name="content"
                                        ref={updateRef}
                                        value={note.content}
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => handleChange(note._id, e)}
                                        onScroll={(e) => { if (suggestionRef1.current) suggestionRef1.current.scrollTop = e.target.scrollTop }}
                                        style={{ scrollbarGutter: "stable" }}
                                        className="px-5 py-4 font-sans text-base leading-6 text-slate-700 dark:text-white outline-none w-full h-full resize-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-300"
                                    />
                                    {(selectedNote) && <div
                                        name="suggestion-text"
                                        ref={suggestionRef1}
                                        style={{ scrollbarGutter: "stable" }}
                                        className={`absolute top-0 left-0 px-5 py-4 w-full h-full pointer-events-none whitespace-pre-wrap overflow-hidden z-0 font-sans text-base leading-6 m-0`}
                                        aria-hidden="true"
                                    >
                                        <span className="text-transparent">{note.content}</span>
                                        <span className="text-slate-400 dark:text-slate-500">{suggestionText}</span>
                                    </div>}

                                </div>
                                <div className="px-5 py-0 flex items-center justify-end h-15 w-full bg-white dark:bg-[#212124]">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpdate(note); }}
                                        className="py-1 px-2  bg-violet-600 hover:bg-violet-700 font-semibold text-white rounded-lg transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )
                ))}
            </AnimatePresence>
        </>
    )
}

export default NoteList;
