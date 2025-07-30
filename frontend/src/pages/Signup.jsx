import { Link, useNavigate } from "react-router-dom";
import bgImg from "../PNG/feet-1868670_1920.jpg"
import { useContext, useState } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import logo from "../PNG/household.png"
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
    const [error, setError] = useState({});
    const {loggedUser, setLoggedUser} = useContext(DataContext)
    const navigate = useNavigate();

    const toHome = () => {
        navigate("/")
    }

    const [inputValues, setInputValues] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        avatar: "",
        gender: "",
        password: "",
    });
    
    const handleChange = (e) => {
        const { value, name } = e.target;
        setInputValues((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };    

    const handleCreate = async (e) => {
        e.preventDefault();
    
        const newErrors = {};
        if (!inputValues.firstName || inputValues.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters long";
        }
        if (!inputValues.lastName || inputValues.lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters long";
        }
        if (!inputValues.username || inputValues.username.trim().length < 2) {
            newErrors.username = "Username must be at least 2 characters long";
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!inputValues.email) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(inputValues.email)) {
            newErrors.email = "Invalid email address";
        }
        const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)(\?.*)?)|^(https?:\/\/.*\/.*)$/;
        if (!inputValues.avatar) {
            newErrors.avatar = "Image URL is required";
        } else if (!urlPattern.test(inputValues.avatar)) {
            newErrors.avatar = "Invalid image URL format";
        }
        const phonePattern = /^[0-9]+$/;
        if (!inputValues.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!phonePattern.test(inputValues.phone)) {
            newErrors.phone = "Invalid phone number";
        }
        if (!inputValues.gender) {
            newErrors.gender = "Gender selection is required";
        }
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,15}$/;
        if (!inputValues.password) {
            newErrors.password = "Password is required";
        } else if (!passwordPattern.test(inputValues.password)) {
            newErrors.password =
                "Password must be 4-15 characters and include at least one uppercase letter, one lowercase letter, and one number";
        }
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        
            try {
                const resp = await axios.post(
                    "http://localhost:5000/api/users/register",
                    inputValues
                );
        
                if (resp.data.success) {
                    const loggedUser = resp.data.data;
                    toast.success("Registration Successful!");
                    console.log(loggedUser);
                    localStorage.setItem("laundry_customer", JSON.stringify(loggedUser));
                    setLoggedUser(loggedUser);
                    navigate("/login");
                }
                setInputValues({
                    firstName: "",
                    lastName: "",
                    username: "",
                    email: "",
                    phone: "",
                    avatar: "",
                    gender: "",
                    password: "",
                });
            }
            catch (error) {
                if (error.response) {
                    console.error("Error:", error.response.status);
                    if (error.response.status === 403) {
                        toast.warn("You do not have permission to access this resource.");
                    }
                } else {
                    console.error("Error:", error.message);
                    toast.error("An error occurred. Please try again.");
                }
            }
        
        
    };          
    
    return (
        <div className="min-h-screen" style={{backgroundImage: `url('${bgImg}')`}} >
            <div className="container mx-auto px-4 py-8 min-h-screen bg-black opacity-85" >
                <nav className="px-4 flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={toHome}>
                        <img src={logo} alt="Sunny Fresh" className="h-10 w-10" />
                        <span className="font-indie text-2xl text-white hover:text-indigo-600">Sunny Fresh</span>
                    </div>
                    <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
                        Login
                    </Link>
                </nav>

                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex">
                        <div className="hidden lg:block lg:w-1/2">
                            <div className="h-full bg-cover bg-center bg-indigo-900">
                                <div className="h-full  p-12 flex flex-col justify-between">
                                    <div className="text-white my-auto">
                                        <h2 className="text-4xl font-bold mb-4">Welcome to Sunny Fresh</h2>
                                        <p className="text-lg">Join our community of satisfied customers and experience premium laundry services.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-8">Create your account</h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input 
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={inputValues.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {error.firstName && <p className="text-red-500 text-xs mt-1">{error.firstName}</p>}
                                    </div>
                                    <div>
                                        <input 
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={inputValues.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {error.lastName && <p className="text-red-500 text-xs mt-1">{error.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input 
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={inputValues.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {error.username && <p className="text-red-500 text-xs mt-1">{error.username}</p>}
                                </div>

                                <div>
                                    <input 
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={inputValues.email}
                                        onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input 
                                            type="text"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={inputValues.phone}
                                            onChange={(e) => setInputValues({ ...inputValues, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
                                    </div>
                                    <div>
                                        <select 
                                            name="gender"
                                            value={inputValues.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                        {error.gender && <p className="text-red-500 text-xs mt-1">{error.gender}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input 
                                        type="text"
                                        name="avatar"
                                        placeholder="Avatar URL"
                                        value={inputValues.avatar}
                                        onChange={(e) => setInputValues({ ...inputValues, avatar: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {error.avatar && <p className="text-red-500 text-xs mt-1">{error.avatar}</p>}
                                </div>

                                <div>
                                    <input 
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={inputValues.password}
                                        onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                                >
                                    Create Account
                                </button>
                            </form>

                            <div className="text-xs text-center">
                                By clicking Create Account, you agree to our <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer">Privacy Policy</span>
                            </div>

                            <p className="text-center text-sm text-gray-600 mt-4">
                                Already have an account?{" "}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;