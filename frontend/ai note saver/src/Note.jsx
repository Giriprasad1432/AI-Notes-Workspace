import { useState, useRef, useEffect } from "react";

const Note = () => {
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
            console.log("both shouldnt be empty")
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/add-note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note)
            });
            const data = await response.json();
            console.log("Save response:", data);
            if (data.success) {
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
            className={`flex flex-col gap-2 items-center w-[70%] px-3 pt-2 text-white bg-gray-900/60 border border-transparent focus-within:border-violet-500/50 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.15)] rounded-2xl transition-all duration-300 ${isFocus ? "h-auto min-h-[120px]" : "h-auto min-h-[50px] "
                }`}
        >
            {isFocus && (
                <input
                    name="title"
                    ref={inputRef}
                    value={note.title}
                    onChange={handleChange}
                    className={`transition-all duration-300 leading-0 py-1 text-center text-3xl border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none w-[90%] bg-transparent`}
                    placeholder="Title"
                    type="text"
                />
            )}
            <textarea
                ref={textareaRef}
                onFocus={handleFocus}
                onBlur={handleFocus}
                name="content"
                value={note.content}
                onChange={handleChange}
                rows={1}
                className="scrollbar-thumb-violet-900/80 scrollbar-thin hover:scrollbar-thumb-violet-700/80 pl-3 pt-3 w-full leading-5 resize-none outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none placeholder:text-slate-500 bg-transparent overflow-y-auto max-h-[50vh]"
                placeholder="Write your Note"
            />
            <div className="flex justify-end items-end w-full gap-2 py-2">
                {isFocus && (
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={saveNote}
                        className="bg-violet-500 cursor-pointer text-white px-4 py-2 rounded-xl transition-transform duration-150 active:scale-95 hover:scale-98"
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
};

export default Note;