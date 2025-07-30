import { Link, useNavigate } from "react-router-dom";
import { IoLogoTumblr } from "react-icons/io";
import bg_image from "../PNG/Tumblr_Logos_2018.03.06_Wordmark White.png"
import { FcGoogle } from "react-icons/fc";
import { DiApple } from "react-icons/di";
import { IoSearchSharp } from "react-icons/io5";
import { IoCompassOutline } from "react-icons/io5";
import { useContext, useState } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";

const AdminSignup = ()=>{
    const [submissions, setSubmissions] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState({});
    const {loggedAdmin, setLoggedAdmin} = useContext(DataContext)
    const navigate = useNavigate();
    
    const toHome = () =>{
        navigate("/home")
    }

    const [inputValues, setInputValues] = useState({
            first_name: "",
            last_name: "",
            user_name: "",
            email: "",
            avatar: "",
            gender: "",
            password: "",
    });

    const validateEmail = () => {
        return /\S+@\S+\.\S+/.test(inputValues.email);
    };

    const validatePassword = () => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/.test(inputValues.password);
    };
    
    const formValidate = () => {
        const newErrors = {};
        if (inputValues.first_name.trim().length < 2) {
        newErrors.first_name = "First name must be at least 2 characters long";
        }
        if (inputValues.last_name.trim().length < 2) {
        newErrors.last_name = "Last name must be at least 2 characters long";
        }
        if (inputValues.user_name.trim().length < 2) {
        newErrors.user_name = "Username must be at least 2 characters long";
        }
        if (!validateEmail()) {
        newErrors.email = "Invalid email address";
        }
        if (!inputValues.avatar) {
        newErrors.email = "Image is required!";
        }
        if (!validatePassword()) {
        newErrors.password =
            "Password must be 4-8 characters long, include at least one uppercase letter, one lowercase letter, and one number";
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setInputValues((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (
            !inputValues.first_name ||
            !inputValues.last_name ||
            !inputValues.user_name ||
            !inputValues.email ||
            !inputValues.gender ||
            !inputValues.avatar ||
            !inputValues.password
        ) {
            alert("All fields must be filled!!");
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputValues.email)) {
            alert("Invalid email format");
            return;
        }
    
        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,8}$/;
        if (!passwordRegex.test(inputValues.password)) {
            alert(
                "Password must be 4-8 characters long, include at least one uppercase letter, one lowercase letter, and one number"
            );
            return;
        }
    
        try {
            // Send the POST request with form data
            const resp = await axios.post(
                "http://localhost:5400/api/users/admin/register",
                inputValues
            );
    
            // Check if the registration was successful
            if (resp.data.success) {
                const loggedAdmin = resp.data.data;
                alert("Registration Successful!");
                console.log(loggedAdmin);
                localStorage.setItem("tumblr_admin", JSON.stringify(loggedAdmin));
                setLoggedAdmin(loggedAdmin); // Assuming this is a state setter
                navigate("/adminLogin");
            }
    
            // Additional form validation and state update
            if (formValidate()) {
                setSubmissions((prevSubmission) => [...prevSubmission, inputValues]);
                setInputValues({
                    first_name: "",
                    last_name: "",
                    user_name: "",
                    email: "",
                    gender: "",
                    password: "",
                    avatar: "",
                });
                setSubmitted(true);
                alert("Form submitted successfully!");
            }
        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.status);
                if (error.response.status === 403) {
                    alert("You do not have permission to access this resource.");
                }
            } else {
                console.error("Error:", error.message);
                alert("An error occurred. Please try again.");
            }
        }
    };
    
    
              
    
    return(
        <>
            <div className="">
                <div className="">
                    <div className="relative h-[120vh] w-full bg-cover bg-no-repeat bg-center" style={{backgroundImage: "url('https://ideogram.ai/assets/progressive-image/balanced/response/kS_mQjP1QnCHwvCti3b86Q')"}}>
                        <div className="py-2 px-4 flex flex-col h-full w-full bg-zinc-900 opacity-70">
                            <div className="flex flex-row justify-between">
                                <div className="flex items-center space-x-3">
                                    <IoLogoTumblr className="text-white size-8"/>
                                    <div className="text-xl text-white flex items-center bg-black opacity-80 py-2 ps-3 pe-[300px] rounded-3xl space-x-2">
                                        <IoSearchSharp />
                                        <p className="text-sm">Search Tumblr</p>
                                    </div>
                                </div>
                               <Link to={"/adminLogin"} className="no-underline text-black">
                                    <div className="">
                                        <button className="text-black bg-green-400 px-3 py-1 rounded font-bold">Login</button>
                                    </div>
                               </Link>
                            </div>
                            <img className="w-[15rem] h-[3rem] flex mx-auto mt-9 hover:cursor-pointer" src={bg_image} onClick={toHome} alt="IMAGES" />
                            <form action="" onSubmit={handleSubmit}>
                                <div className="w-full h-fit flex flex-col mx-auto mt-16 space-y-2">
                                    <input type="text" onChange={handleChange} name="first_name" value={inputValues.first_name} className="bg-white w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Firstname" />
                                    <input type="text" onChange={handleChange} name="last_name" value={inputValues.last_name} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Lastname"/>
                                    <input type="text" onChange={handleChange} name="user_name" value={inputValues.user_name} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Username"/>
                                    <input type="text" onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })} name="email" value={inputValues.email} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Email"/>
                                    <input type="text" onChange={(e) => setInputValues({ ...inputValues, avatar: e.target.value })} name="avatar" value={inputValues.avatar} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg bg-white" placeholder="Avatar"/>
                                    <select name="gender" onChange={handleChange} value={inputValues.gender} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" id="">
                                        <option value="">Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    <input onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })} name="password" value={inputValues.password} type="password" className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Password"/>
                                    
                                </div>
                                
                                <div className="mx-auto mt-5 w-[30%]">
                                    <button className="bg-blue-400 p-2 text-center rounded w-full">Sign up</button>
                                    <p className="text-white text-center p-2">_______________________ or __________________________</p>
                                </div>
                            </form>
                            <div className="w-full h-fit flex flex-col space-y-2">
                                <p className="mx-auto w-[30%] h-[60%] rounded flex justify-center p-2 bg-white items-center"><FcGoogle className="mr-5" />Continue with Google</p>
                                <p className="mx-auto w-[30%] h-[60%] rounded flex justify-center p-2 bg-white items-center"><DiApple  className="mr-5"/>Continue with Apple</p>
                                <p className="text-white text-center p-2 mx-auto items-center flex"><IoCompassOutline className="size-5"/>Here's what's trending</p>
                            </div>
                        </div>
                        <div className="fixed bottom-20 left-10 items-center text-white space-x-3 text-">
                            <ul className="flex space-x-2">
                                <li className="cursor-pointer">Terms</li>
                                <li className="cursor-pointer">Privacy</li>
                                <li className="cursor-pointer">Jobs</li>
                                <li className="cursor-pointer">Support</li>
                            </ul>
                        </div>
                        <div className="fixed bottom-20 flex right-10 text-white space-x-2">
                            <p>Posted by The Bald Baron</p>
                            <img className="rounded-full object-cover object-center size-5 items-center flex" src='https://ideogram.ai/assets/progressive-image/balanced/response/q0DBy_u3Q3KdBbIV3jgI3Q' alt="IMAGES" />
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
export default AdminSignup;