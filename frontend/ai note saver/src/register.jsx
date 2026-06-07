import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [registerError, setRegisterError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    }

    const postFormData = async () => {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let tempErrors = {}
        const passwordExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&()])[A-Za-z\d@$!%*?&()]{8,20}$/;
        if (!formData.name) {
            tempErrors.name = "Name shouldn't be Empty"
            setLoading(false);
        }
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
        if (tempErrors.name || tempErrors.email || tempErrors.password) {
            setErrors(tempErrors);
            setRegisterError("");
            return;
        }
        setFormData({ ...formData, email: formData.email.toLowerCase() });
        try {
            const data = await postFormData();
            console.log("data from backend: ", data);
            if (data.success) {
                alert("Registered successfully");
                navigate("/");
            }
            else {
                setRegisterError(data.message);
            }
        } catch (error) {
            console.log(error);
            setRegisterError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
        tempErrors = {};
        setErrors({ name: "", email: "", password: "" });
        setFormData({ name: "", email: "", password: "" })
    }

    return (
        <>
            <div className="relative flex flex-col pt-20 justify-center items-center h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300 px-4">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/30 backdrop-blur-2xl rounded-2xl p-10 flex flex-col gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300">
                    <div className="space-y-1 text-center">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white bg-linear-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text">Register</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Please enter your details to sign up</p>
                    </div>
                    {registerError && <p className="text-center text-red-500 dark:text-red-400 text-xs ml-1 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">{registerError}</p>}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            Name
                        </label>
                        {errors.name && <p className="text-red-500 dark:text-red-400 text-xs ml-1">{errors.name}</p>}
                        <input onChange={handleChange}
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            placeholder="Enter your full name"
                            className="w-full bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                    </div>

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
                        className="cursor-pointer w-full mt-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-2">
                        Already have an account? <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors cursor-pointer hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Register;
