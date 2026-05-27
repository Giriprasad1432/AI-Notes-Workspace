import { useState, useEffect } from "react"
const NoteList = () => {
    const [notes, setNotes] = useState([]);

    const getNotes = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/get-notes", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            console.log("Get notes response:", data);
            if (data.success) {
                setNotes(data.data);
            } else {
                console.warn("Failed to get notes:", data.message);
            }
        } catch (error) {
            console.error("Get notes failed:", error);
        }
    }
    const truncateTitle = (title, maxLength = 15) => {
    if (!title) return "";
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trimEnd() + "...";
};


    useEffect(() => {
        getNotes();
    }, []);
    return (
        <div className=" w-full flex flex-col gap-2 p-2 h-fit border border-slate-900">
            {notes.map((note) => (
                <div key={note._id} className="hover:border-violet-700/70 hover:scale-105 transition-transform transform duration-150 ease-in-out hover:bg-violet-900/30 flex flex-col gap-2 bg-[#212124]/80 border rounded-md overflow-hidden">
                    <h1 className="font-bold text-xl text-white p-2 text-center">{truncateTitle(note.title, 30)}</h1>
                    <p className="text-slate-200 text-sm p-2 text-center">{truncateTitle(note.content, 100)}</p>
                </div>
            ))}
        </div>
    )
}

export default NoteList