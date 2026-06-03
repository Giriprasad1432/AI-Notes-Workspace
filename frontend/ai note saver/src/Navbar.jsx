import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"

const Navbar = () => {
    const { isLoggedIn, login, logout } = useAuth();
    const handleLogout=()=>{
        alert("do you want to logout?")
        logout()
    }
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/30 backdrop-blur-md border-b border-slate-900/80 px-8 py-3.5  transition-all duration-300">
            {isLoggedIn ?
                <div className="flex items-center justify-between w-full pl-5">
                    <div>
                        <Link to="/" className="text-2xl font-extrabold bg-linear-to-r from-blue-400  to-violet-400 bg-clip-text text-transparent tracking-wider hover:opacity-90 transition-opacity">
                            AI Notes
                        </Link>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-white flex items-center text-center text-sm font-semibold rounded px-2 py-1 bg-linear-to-r from-blue-400/50 via-indigo-400/50 to-violet-400/50 ">
                            Dashboard
                        </div>
                        <Link className="text-white flex items-center text-center text-sm font-semibold rounded-2xl px-4 py-2 bg-violet-900/20 border-2  border-violet-600/40 hover:bg-violet-600/40" onClick={handleLogout} to="/">Logout</Link>
                    </div>
                </div> :
                <div className="flex items-center justify-between w-full pl-5">
                    <div>
                        <Link to="/" className="text-2xl font-extrabold bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-wider hover:opacity-90 transition-opacity">
                            AI Notes
                        </Link>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/" className="text-white text-center text-sm font-semibold rounded-2xl px-4 py-2 bg-blue-950/30 border-2  border-blue-600/40 hover:bg-blue-900/40">
                            Login
                        </Link>
                        <Link to="/register" className="text-white text-center text-sm font-semibold rounded-2xl px-4 py-2 bg-linear-to-r from-blue-400/50 via-indigo-400/50 to-violet-400/50 border border-violet-500/30 hover:border-blue-600/40 hover:bg-blue-600/40">
                            Register
                        </Link>
                    </div>
                </div>
            }
        </nav>
    )
}

export default Navbar