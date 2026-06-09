import { Eye, EyeOff } from 'lucide-react'
import { useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Navbar from './NavBar';
import { useAuth } from './AuthContext';
import {motion} from "framer-motion";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    }

    useEffect(() => {
        if (login) {
            navigate("/dashboard");
        }
    }, [login, navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let tempErrors = {}
        const passwordExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&()])[A-Za-z\d@$!%*?&()]{8,20}$/;
        if (!formData.email) {
            tempErrors.email = "Email shouldn't be Empty"
            setLoading(false);
        }
        if (!formData.password) {
            tempErrors.password = "Password shouldn't be Empty"
            setLoading(false);
        }
        else if (!passwordExp.test(formData.password)) {
            tempErrors.password = "password must meet the requirements!"
            setLoading(false);
        }
        if (tempErrors.email || tempErrors.password) {
            setErrors(tempErrors);
            setLoginError("");
            return;
        }
        setLoginError("");
        
        try {
            const currentData = { ...formData, email: formData.email.toLowerCase() };
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentData)
            });
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem("authToken", data.token);
                await login();
                setErrors({ email: "", password: "" });
                navigate("/dashboard");
            } else {
                setLoginError(data.message);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoginError("Something went wrong. Please try again later.");
            setLoading(false);
        }
    }

    return (
        <>
            <div className="relative min-h-screen flex justify-center items-center w-full pt-20 pb-8 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300 px-4">
                
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ y:0,opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    onSubmit={handleSubmit} className="relative z-10 w-full max-w-md border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/30 backdrop-blur-2xl rounded-2xl p-6 sm:p-10 flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    <div className="space-y-2 text-center mb-2">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight bg-linear-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Please enter your details to sign in</p>
                    </div>
                    {loginError && <p className="text-center text-red-500 dark:text-red-400 text-xs ml-1 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">{loginError}</p>}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            E-mail
                        </label>
                        {errors.email && <p className="text-red-500 dark:text-red-400 text-xs ml-1">{errors.email}</p>}
                        <input onChange={handleChange}
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            placeholder="Enter your email"
                            className="w-full bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            Password
                        </label>
                        {errors.password && <p className="text-red-500 dark:text-red-400 text-xs ml-1">{errors.password}</p>}
                        <div className="relative">
                            <input onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                placeholder="Enter your password"
                                className="w-full bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                         <p className="text-xs text-slate-500 dark:text-gray-500 ml-1">* Password must consists of a capital letter,a number and a special character! (and should be 8-20 characters long)</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full mt-4 bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-2">
                        Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors cursor-pointer hover:underline">Sign up</Link>
                    </p>
                </motion.form>
            </div>
        </>
    )
}

export default Login;
