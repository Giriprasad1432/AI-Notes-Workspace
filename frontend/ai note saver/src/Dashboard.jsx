import Note from "./Note"

const Dashboard = () => {
    return (
        <div className="w-full bg-black h-screen flex items-start justify-center pt-24 relative overflow-hidden">
            <div className="z-1 absolute bottom-[-10%]  right-[-10%]  w-[40%] h-[40%] border border-slate-800 bg-violet-500/10 rounded-full blur-3xl" ></div>
            <div className="z-1 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-slate-800 bg-violet-500/10 rounded-full blur-3xl" ></div>
            <div className="z-50 flex items-center justify-end w-[90%] h-[80%]">
                <Note />
            </div>
        </div>
    )
}

export default Dashboard;