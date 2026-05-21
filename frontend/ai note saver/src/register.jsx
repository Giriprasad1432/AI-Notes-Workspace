import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register=()=>{
    const navigate = useNavigate();
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:""
    })
    const [loading,setLoading]=useState(false);
    const [errors,setErrors]=useState({name:"",email:"",password:""});
    const [showPassword,setShowPassword]=useState(false);
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
        if(!formData.name){
            tempErrors.name="Name shouldn't be Empty"
            setLoading(false);
            return;
        }
        if (!formData.email) {
            tempErrors.email = "Email shouldn't be Empty"
            setLoading(false);
            return;
        }
        if (!formData.password) {
            tempErrors.password = "Password shouldn't be Empty"
            setLoading(false);
            return;
        }
        else if (!passwordExp.test(formData.password)) {
            tempErrors.password = "password must meet the requirements!"
            setLoading(false);
            return;
        }
        setErrors(tempErrors);
        setRegisterError("");
        try {
            const data = await postFormData();
            console.log("data from backend: ", data);
            if (data.success) {
                alert("Registered successfully");
                navigate("/")
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
        setErrors({ email: "", password: "" });
    }
    
    return(
        <div className="flex justify-center items-center min-h-screen w-full bg-slate-950 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md border border-slate-800 bg-slate-900/40 backdrop-blur-xl rounded-2xl p-10 flex flex-col gap-6 shadow-2xl">
                <div className="space-y-2 text-center mb-4">
                    <h2 className="text-4xl font-bold text-white tracking-tight">Register yourself</h2>
                    <p className="text-slate-400 text-sm">Please enter your details to sign up</p>
                </div>
                {registerError && <p className="text-center text-red-400 text-xs ml-1">{registerError}</p>}

                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-300 ml-1">
                        Name
                    </label>
                    {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name}</p>}
                    <input onChange={handleChange}
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        placeholder="Enter your full name"
                        className="w-full bg-slate-800/50 text-white border border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">
                        E-mail
                    </label>
                    {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email}</p>}
                    <input onChange={handleChange}
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        className="w-full bg-slate-800/50 text-white border border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" entry="password" className="text-sm font-medium text-slate-300 ml-1">
                        Password
                    </label>
                    {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password}</p>}
                    <div className="relative">
                        <input onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
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
                    disabled={loading}
                    className=" cursor-pointer w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                    {loading?"Creating account...":"Create account"}
                </button>

                <p className="text-center text-slate-500 text-sm mt-2">
                    Already have an account? <Link to="/" className="text-blue-400 hover:underline cursor-pointer">Sign in</Link>
                </p>
            </form>
        </div>
    )
}

export default Register