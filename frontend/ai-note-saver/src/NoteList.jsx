import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import handleAiSuggestion from "./AiSuggestion";
import { vite_api_url } from "./config";
import { useUI } from "./UIContext";
import { Search, X, ChevronRight, BookOpen } from "lucide-react";

const layoutTiming = {
    type: "spring",
    duration: 0.6,
    bounce: 0.15,
    ease: "easeOut",
};


const NoteList = ({ selectedNote, onSelectNote, refreshNotes }) => {
    const [notes, setNotes] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
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

    useEffect(() => {
        if (selectedNote?._id || isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedNote, isDrawerOpen]);

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
            if (data.success) setNotes(data.data);
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

    const filteredNotes = notes.filter(note => 
        (note.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         note.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            <div ref={notelistRef} className="w-fit max-w-[calc(100vw-1rem)] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-row-reverse gap-2 px-2 pb-2 bottom-5 mt-3 md:bottom-10 right-2 sm:right-10 fixed z-[40] select-none">
                {notes.slice(0, 7).reverse().map((note) => {
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
                                className="fixed z-[120] top-0 left-0 w-full h-full bg-black/20 dark:bg-black/40 backdrop-blur-xs"
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
                                className="flex flex-col rounded-2xl w-[92%] max-w-[600px] h-[65vh] sm:h-[400px] z-[125] border bg-white dark:bg-[#212124] shadow-2xl border-slate-200 dark:border-[#222222] overflow-hidden scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-900/50 scrollbar-thin hover:scrollbar-thumb-violet-300 dark:hover:scrollbar-thumb-violet-800/80 transition-colors duration-300"
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

            {/* Floating Library Button */}
            <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDrawerOpen(true)}
                className="fixed bottom-40 md:bottom-44 right-4 sm:right-12 z-[45] w-12 h-12 rounded-full shadow-lg bg-white/95 dark:bg-[#212124]/95 border border-slate-200 dark:border-zinc-800 hover:border-violet-500/50 dark:hover:border-violet-500/50 text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 flex items-center justify-center cursor-pointer backdrop-blur-md"
                title="All Notes"
            >
                <BookOpen className="w-5.5 h-5.5" />
            </motion.button>

            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/15 dark:bg-black/40 backdrop-blur-xs z-[110]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 26, stiffness: 220 }}
                            className="fixed top-0 right-0 h-full w-[90%] sm:w-[450px] bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md border-l border-slate-200 dark:border-zinc-800/80 z-[115] shadow-2xl flex flex-col p-6 overflow-hidden"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80">
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">All Notes</h2>
                                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">{notes.length}</span>
                                </div>
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="my-4 relative flex items-center">
                                <Search className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/50 dark:bg-zinc-900/50 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1 -mr-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800/50 hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-zinc-700/80 transition-colors">
                                <div className="flex flex-col gap-3 pr-2 pb-6">
                                    {filteredNotes.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                                            <Search className="w-10 h-10 mb-2 opacity-30" />
                                            <p className="text-sm">No notes found</p>
                                        </div>
                                    ) : (
                                        filteredNotes.map((noteItem) => (
                                            <motion.div
                                                key={`drawer-${noteItem._id}`}
                                                whileHover={{ y: -2, scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => {
                                                    onSelectNote(noteItem);
                                                    setIsDrawerOpen(false);
                                                }}
                                                className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-violet-500/50 dark:hover:border-violet-500/50 hover:bg-slate-50/50 dark:hover:bg-zinc-900/60 shadow-xs cursor-pointer flex flex-col gap-1 transition-all duration-200 group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate pr-4 text-base">
                                                        {noteItem.title || "Untitled"}
                                                    </h3>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-violet-500 transition-colors shrink-0" />
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 break-words">
                                                    {noteItem.content || "Empty content"}
                                                </p>
                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50 dark:border-zinc-800/40">
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                        {new Date(noteItem.updatedAt).toLocaleDateString(undefined, {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default NoteList;
