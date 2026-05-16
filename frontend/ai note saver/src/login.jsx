import { Eye, EyeOff } from 'lucide-react'
import {useState} from 'react';
const Login = () => {
    const [showPassword,setShowPassword]=useState(false);
    return (
        <div className="flex justify-center items-center min-h-screen w-full bg-slate-950 p-4">
            <form className="w-full max-w-md border border-slate-800 bg-slate-900/40 backdrop-blur-xl rounded-2xl p-10 flex flex-col gap-6 shadow-2xl">
                <div className="space-y-2 text-center mb-4">
                    <h2 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm">Please enter your details to sign in</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">
                        E-mail
                    </label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        className="w-full bg-slate-800/50 text-white border border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" entry="password" className="text-sm font-medium text-slate-300 ml-1">
                        Password
                    </label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            id="password" 
                            name="password" 
                            placeholder="Enter your password" 
                            className="w-full bg-slate-800/50 text-white border border-slate-700 pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                    Sign In
                </button>

                <p className="text-center text-slate-500 text-sm mt-2">
                    Don't have an account? <span className="text-blue-400 hover:underline cursor-pointer">Sign up</span>
                </p>
            </form>
        </div>
    )
}

export default Login