import Note from "./Note.jsx"
import NoteList from "./NoteList.jsx"
import { useState } from "react";

const Dashboard = () => {
    const [selectedNote, setSelectedNote] = useState({ title: "", content: "" });
    const [refreshNotes, setRefreshNotes] = useState(0);

    return (
        <div className="overflow-hidden w-full px-5 bg-slate-50 dark:bg-black min-h-screen flex items-start justify-center pt-24 pb-36 sm:pb-44 relative overflow-x-hidden transition-colors duration-300">
            <div className="z-1 absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] border border-slate-200 dark:border-slate-800 bg-violet-500/2 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" ></div>
            <div className="z-1 absolute top-[-10%] left-[-10%] w-[35%] h-[35%] border border-slate-200 dark:border-slate-800 bg-violet-500/2 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" ></div>

            <NoteList onSelectNote={setSelectedNote} selectedNote={selectedNote} refreshNotes={refreshNotes} />

            <section className="z-1 flex items-center justify-center w-full h-[60vh]">
                <Note setRefreshNotes={setRefreshNotes} />
            </section>
        </div>
    )
}

export default Dashboard;
