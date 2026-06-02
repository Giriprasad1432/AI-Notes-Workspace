import { useState, useEffect } from "react"
import { motion, AnimatePresence, easeInOut } from "framer-motion"

const layoutTiming = {
    type: "spring",
    duration: 0.6,
    bounce:0.15,
    ease: "easeOut",
};

const NoteList = ({ selectedNote, onSelectNote,refreshNotes }) => {
    const [notes, setNotes] = useState([]);

    const handleChange = (id, e) => {
        setNotes(prevNotes => prevNotes.map(prevNote =>
            prevNote._id === id ? { ...prevNote, [e.target.name]: e.target.value } : prevNote
        ));
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
        const response = await fetch(`http://localhost:5000/api/update-note/${note._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note),
        });
        return await response.json();
    }

    const getNotes = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/get-notes", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            if (data.success) setNotes(data.data.slice(0, 7).reverse());
        } catch (error) {
            console.error("Get notes failed:", error);
        }
    }

    const truncateTitle = (title, maxLength = 15) => {
        if (!title) return "";
        return title.length <= maxLength ? title : title.substring(0, maxLength).trimEnd() + "...";
    };

    useEffect(() => { getNotes(); }, [refreshNotes]);

    return (
        <div className="w-fit flex flex-row-reverse gap-2 p-2 absolute bottom-10 right-10 z-5 select-none">
            {notes.map((note) => {
                const isSelected = selectedNote._id === note._id;
                return (
                    <div
                        key={note._id}
                        className="h-30 w-50 flex-shrink-0 relative"
                        style={{ contain: "layout size" }}
                    >
                        {!isSelected && (
                            <motion.div
                                layoutId={`note-${note._id}`}
                                transition={{ duration:1.5, layout: layoutTiming }}
                                initial={{
                                    opacity: 0
                                }}
                                animate={{
                                    opacity: 1
                                }}
                                style={{ willChange: "transform" }}
                                className="absolute inset-0 cursor-pointer border border-transparent hover:border-blue-700/70 hover:bg-blue-950/20 bg-[#212124]/70 rounded-md overflow-hidden"
                                onClick={() => onSelectNote(note)}
                            >
                                <motion.div
                                    className="h-full w-full flex flex-col gap-2 justify-center p-2"
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ type: "tween", duration: 0.14 }}
                                >
                                    <h1 className="font-bold text-xl text-white text-center">{truncateTitle(note.title, 30)}</h1>
                                    <p className="text-slate-200 text-sm text-center">{truncateTitle(note.content, 100)}</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                );
            })}

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
                                className="fixed z-40 top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
                            />

                            <motion.div
                                layoutId={`note-${note._id}`}
                                transition={{ layout: layoutTiming }}
                                onClick={(e) => e.stopPropagation()}
                                initial={{ x: "-50%", y: "-50%" }}
                                animate={{ x: "-50%", y: "-50%" }}
                                style={{
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                                    willChange: "transform"
                                }}
                                className="flex flex-col rounded-2xl w-[90%] max-w-[600px] h-[350px] z-50 border bg-[#212124] shadow-2xl border-[#222222] overflow-hidden scrollbar-thumb-violet-900/50 scrollbar-thin hover:scrollbar-thumb-violet-800/80"
                            >
                                <input
                                    placeholder="Title"
                                    name="title"
                                    value={note.title}
                                    onChange={(e) => handleChange(note._id, e)}
                                    className="outline-none text-center text-2xl py-4 text-slate-200 font-semibold bg-transparent"
                                />
                                <div className="border-b border-violet-950/50"></div>
                                <textarea
                                    placeholder="Enter Content"
                                    name="content"
                                    value={note.content}
                                    onChange={(e) => handleChange(note._id, e)}
                                    className="px-5 py-4 text-white outline-none w-full h-full resize-none bg-transparent"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleUpdate(note); }}
                                    className="absolute bottom-4 right-6 cursor-pointer py-2 px-4 bg-violet-600 hover:bg-violet-700 font-bold text-white rounded-lg transition-colors"
                                >
                                    Update
                                </button>
                            </motion.div>
                        </div>
                    )
                ))}
            </AnimatePresence>
        </div>
    )
}

export default NoteList;
