import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"

const Navbar = () => {
    const { isLoggedIn, login, logout } = useAuth();
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/30 backdrop-blur-md border-b border-slate-900/80 px-8 py-3.5  transition-all duration-300">
            {isLoggedIn ?
                <div className="flex items-center justify-between w-full pl-5">
                    <div>
                        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-wider hover:opacity-90 transition-opacity">
                            AI Notes
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/notes">
                            Dashboard
                        </Link>
                    </div>
                </div> :
                <div className="flex items-center justify-between w-full pl-5">
                    <div>
                        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-wider hover:opacity-90 transition-opacity">
                            AI Notes
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="cursor-pointer text-slate-300 hover:text-white px-5 py-2 rounded-xl text-sm font-semibold border border-slate-800 hover:bg-slate-900/50 hover:border-slate-700/80 transition-all duration-300 active:scale-[0.98]"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            }
        </nav>
    )
}

export default Navbar