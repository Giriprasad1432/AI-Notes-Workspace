import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"
import { Sun, Moon } from "lucide-react"
import { useUI } from "./UIContext.jsx"

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();
    const handleLogout = () => {
        alert("do you want to logout?")
        logout()
    }
    const { isLight, setIsLight } = useUI();
    
    return (
        <nav className="shadow-sm h-18 shadow-slate-900/10 dark:shadow-slate-900 fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/30 backdrop-blur-md border-b border-slate-200 dark:border-slate-900/80 px-8 py-3.5 transition-all duration-300">
            <div className="flex items-center justify-between w-full pl-5">
                <div>
                    <Link to="/" className="text-2xl font-extrabold bg-linear-to-r from-blue-500 to-violet-500 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent tracking-wider hover:opacity-90 transition-opacity">
                        AI Notes
                    </Link>
                </div>
                {isLoggedIn ?
                    <div className="flex gap-5 items-center">
                        <button
                            onClick={() => setIsLight(!isLight)}
                            className="p-1.5 w-8 h-8 text-white bg-black rounded-full border border-zinc-800 transition-transform duration-75 active:scale-95 hover:scale-105 flex items-center justify-center dark:bg-white dark:text-black"
                        >
                            {isLight ? (
                                <Sun className="w-4 h-4 fill-white" />
                            ) : (
                                <Moon className="w-4 h-4 fill-black text-black" />
                            )}
                        </button>
                        <Link className="text-slate-700 dark:text-white flex items-center text-center text-sm font-semibold rounded-2xl px-4 py-2 bg-violet-100 dark:bg-violet-900/20 border-2 border-violet-200 dark:border-violet-600/40 hover:bg-violet-200 dark:hover:bg-violet-600/40" onClick={handleLogout} to="/">Logout</Link>
                    </div>
                    :
                    <div className="flex gap-5 items-center">
                        <button
                            onClick={() => setIsLight(!isLight)}
                            className="p-1.5 w-8 h-8 text-white bg-black rounded-full border border-zinc-800 transition-transform duration-75 active:scale-95 hover:scale-105 flex items-center justify-center dark:bg-white dark:text-black"
                        >
                            {isLight ? (
                                <Sun className="w-4 h-4 fill-white" />
                            ) : (
                                <Moon className="w-4 h-4 fill-black text-black" />
                            )}
                        </button>
                        <Link to="/" className="text-slate-700 dark:text-white text-center text-sm font-semibold rounded-2xl px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-600/40 hover:bg-blue-100 dark:hover:bg-blue-900/40">
                            Login
                        </Link>
                        <Link to="/register" className="text-white text-center text-sm font-semibold rounded-2xl px-4 py-2 bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500 dark:from-blue-400/50 dark:via-indigo-400/50 dark:to-violet-400/50 border border-violet-500/30 hover:opacity-90">
                            Register
                        </Link>
                    </div>
                }
            </div>
        </nav>
    )
}

export default Navbar;
