import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import axios from "axios";
import { FaCircleInfo } from "react-icons/fa6";
import employee from "../PNG/2Ew7PvNYRceRcZ-aXf4LTA.webp"
import admin from "../PNG/ChE-mt3AQNacSntZ4kTcuA.webp"
import supplier from "../PNG/premium_photo-1663091838463-82ec12b917e8.avif"
import logo from "../PNG/household.png"
import { toast, ToastContainer } from "react-toastify";

const Login = ()=>{    
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState({});
    const [seeGallery, setSeeGallery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {setLoggedUser, loggedUser} = useContext(DataContext);
    const navigate = useNavigate();
    const onNavigate = () => {setSeeGallery(true)};
    const onClose = () => {setSeeGallery(false)};
    const [inputValues, setInputValues] = useState({
            email: "",
            password: "",
    });

    // Clear any existing user data when login page loads
    useEffect(() => {
        localStorage.removeItem("laundry_customer_loggedUser");
        localStorage.removeItem("Logged_customer_token");
        localStorage.removeItem("laundry_admin");
        localStorage.removeItem("laundry_employee_loggedUser");
        localStorage.removeItem("laundry_supplier_loggedUser");
        setLoggedUser({});
    }, []);

    const validatePassword = () => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/.test(inputValues.password);
    };
    const validateEmail = () => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputValues.email);
    };
    
    const toHome = () => {
        navigate("/");
    }
    
    const formValidate = () => {
        const newErrors = {};
        if (!validateEmail()) {
            newErrors.email = "Invalid email address";
        }
        if (!validatePassword()) {
            newErrors.password = "Password must be 6-15 characters long, include at least one uppercase letter, one lowercase letter, and one number";
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!inputValues.email || !inputValues.password) {
                toast.warn("All fields must be filled!!", {autoClose:2000});
                return;
            }
            if (!formValidate()) return;
            
            const response = await axios.post("http://localhost:5000/api/users/login", inputValues);
            setSubmitted(true);
            
            if(response.status === 200 && response.data.data.role === "customer"){
                console.log("Welcome back User:", response.data);
                toast.success("Credentials Accepted!", {autoClose:2000});
                const loggedUser = response.data.data;
                localStorage.setItem("laundry_customer_loggedUser", JSON.stringify(loggedUser));
                setLoggedUser(loggedUser);
                localStorage.setItem("Logged_customer_token", response.data.token);
                navigate("/services");
            }
            else if(response.status === 200 && response.data.data.role !== "customer"){
                console.log("Incorrect Login Route");
                toast.error("Invalid Path Route", {autoClose:2000});
                setInputValues({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.status);
                if (error.response.status === 403) {
                    toast.warn("You do not have permission to access this resource.", {autoClose:2000});
                }
                else if(error.response.status === 401){
                    toast.error("Invalid Credentials", {autoClose:2000});
                    setInputValues({                
                        email: "",
                        password: "",
                    });
                }
                else{
                    toast.error("Login Failed: Email or Password is incorrect", {autoClose:2000});
                    setInputValues({
                        email: "",
                        password: ""
                    });
                }
            } else {
                toast.error("Connection error. Please try again later.", {autoClose:2000});
                console.error("Error:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }
    
    return(
        <>
            <div>
                <div className="font-indie">
                    <div className="relative">
                        {seeGallery && (
                            <div className="fixed w-full h-[100vh] z-10 bg-black opacity-90 p-6 rounded shadow-lg text-center">
                                <div className="mt-[40vh] flex flex-col">
                                    <div className="flex flex-row gap-4 mx-auto items-center px-10">
                                        <Link to={"/adminLogin"}>
                                            <div className="flex flex-col rounded-full cursor-pointer border hover:bg-white py-6 px-7">
                                                <img src={admin} alt="admin" className="size-20 rounded-full text-white mx-auto"/>
                                                <p className="text-white hover:text-blue-950">Administrator</p>
                                            </div>
                                        </Link>
                                        <Link to={"/employeeLogin"}>
                                            <div className="flex flex-col rounded-full cursor-pointer border hover:bg-white py-6 px-9">
                                                <img src={employee} alt="employee" className="size-20 rounded-full text-orange-700 mx-auto"/>
                                                <p className="text-white hover:text-blue-950">Employee</p>
                                            </div>
                                        </Link>
                                        <Link to={"/supplierLogin"}>
                                            <div className="flex flex-col rounded-full cursor-pointer border hover:bg-white py-6 px-9">
                                                <img src={supplier} alt="supllier" className="size-20 rounded-full object-cover object-top  text-yellow-600 mx-auto"/>
                                                <p className="text-white hover:text-blue-950">Supplier</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <button className="p-3 border w-fit mx-auto rounded-3xl mt-5 text-white" onClick={onClose}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="h-[100vh] w-full bg-cover bg-no-repeat bg-center relative" 
                         style={{backgroundImage: "url('https://images.unsplash.com/photo-1521656543453-e4cac36c0c40?q=80&w=1374&auto=format&fit=crop')"}} >
                        <div className="py-4 px-4 flex flex-col h-full w-full bg-black bg-opacity-70">
                            <div className="py-4 px-4 flex flex-row justify-between items-center mb-8">
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={toHome}>
                                    <img src={logo} alt="logo" className="h-10 w-10" />
                                    <span className="font-indie text-2xl text-white hover:text-indigo-400 transition">Sunny Fresh</span>
                                </div>
                                <Link to="/signup" className="bg-indigo-600 font-sans text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
                                    Sign up
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="max-w-md mx-auto w-96 mt-16 bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl">
                                <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        {error.email && <p className="text-red-400 text-sm mb-1">{error.email}</p>}
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 font-sans bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="email"
                                            value={inputValues.email || ""}
                                            onChange={handleChange}
                                            placeholder="Email"
                                        />
                                    </div>

                                    <div>
                                        {error.password && <p className="text-red-400 text-sm mb-1">{error.password}</p>}
                                        <input 
                                            type="password"
                                            className="w-full px-4 py-3 font-sans bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            name="password"
                                            value={inputValues.password || ""}
                                            onChange={handleChange}
                                            placeholder="Password"
                                        />
                                    </div>

                                    <button 
                                        className="w-full font-sans bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Logging in..." : "Login"}
                                    </button>

                                    <div className="mt-4 text-center">
                                        <button 
                                            type="button"
                                            onClick={onNavigate}
                                            className="flex mx-auto items-center gap-2 text-white font-sans text-xs hover:text-indigo-400 transition relative group"
                                        >
                                            Login to Our Management System Dashboard 
                                            <div className="relative">
                                                <FaCircleInfo />
                                                <div className="absolute top-full -left-28 transform -translate-x-1/2 translate-y-[8px] 
                                                    px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-80 
                                                    transition-opacity whitespace-nowrap mt-6">
                                                    must have access and privileges; given by the administratior
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="absolute bottom-8 left-0 right-0">
                                <div className="container mx-auto px-4 flex justify-between items-center">
                                    <ul className="flex space-x-6 text-white/70 text-xs">
                                        <li className="hover:text-white cursor-pointer">Terms</li>
                                        <li className="hover:text-white cursor-pointer">Privacy</li>
                                        <li className="hover:text-white cursor-pointer">Jobs</li>
                                        <li className="hover:text-white cursor-pointer">Support</li>
                                    </ul>
                                    <div className="flex items-center space-x-2 text-white/70 animate-pulse">
                                        <p>Enter the site to view our latest offers</p>
                                        <img className="h-5 w-5 rounded-full object-cover" src='https://ideogram.ai/assets/progressive-image/balanced/response/q0DBy_u3Q3KdBbIV3jgI3Q' alt="IMAGES" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default Login;