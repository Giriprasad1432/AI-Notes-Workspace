import Note from "./Note.jsx"
import NoteList from "./NoteList.jsx"
import { useState } from "react";

const Dashboard = () => {
    const [selectedNote, setSelectedNote] = useState({ title: "", content: "" });
    const [refreshNotes,setRefreshNotes]=useState(0);
    return (
        <div className="w-full px-5 bg-black h-screen flex items-start justify-center pt-24 relative overflow-hidden">
            <div className="z-1 absolute bottom-[-10%]  right-[-10%]  w-[40%] h-[40%] border border-slate-800 bg-violet-500/10 rounded-full blur-3xl" ></div>
            <div className="z-1 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-slate-800 bg-violet-500/10 rounded-full blur-3xl" ></div>
                <NoteList onSelectNote={setSelectedNote} selectedNote={selectedNote} refreshNotes={refreshNotes} />
            <section className="pr-10 z-1 flex items-center justify-end w-full h-[80%]">
                <Note setRefreshNotes={setRefreshNotes}/>
            </section>
        </div>
    )
}

export default Dashboard;