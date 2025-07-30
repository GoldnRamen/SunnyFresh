import { Link, useNavigate } from "react-router-dom";
import bgImg from "../PNG/feet-1868670_1920.jpg"
import { FcGoogle } from "react-icons/fc";
import { useContext, useState } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";

import logo from "../PNG/household.png"
import { toast, ToastContainer } from "react-toastify";

const UpdateCustomer = ()=>{
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const loggedUser = localStorage.getItem("laundry_customer_loggedUser")
    const customerId = loggedUser.id;

    const toHome = () =>{
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
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,8}$/;
        if (!inputValues.password) {
            newErrors.password = "Password is required";
        } else if (!passwordPattern.test(inputValues.password)) {
            newErrors.password =
            "Password must be 6-15 characters, include at least one uppercase letter, one lowercase letter, and one number";
        }
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        
        try {
            const resp = await axios.put(
              `http://localhost:5000/api/users/customer/edit/${customerId}`,
              inputValues
            );
      
            if (resp.data.success) {
              toast.success("Customer details updated successfully!", {autoClose:2000});
            //   setCustomerData((prevState) =>
            //     prevState.map((customer) =>
            //       customer._id === customerId ? { ...customer, ...inputValues } : customer
            //     )
            //   );
              navigate("/login")
              setInputValues({
                firstName: "",
                lastName: "",
                phone: "",
                avatar: "",
                gender: "",
                password: "",
              });
            } else {
              toast.error("Something went wrong while updating!", {autoClose:2000});
              setInputValues({
                firstName: "",
                lastName: "",
                phone: "",
                avatar: "",
                gender: "",
                password: "",
              });
            }
          } catch (error) {
            if (error.response) {
              console.error("Error:", error.response.status);
              if (error.response.status === 403) {
                toast.warn("You do not have permission to access this resource.", {autoClose:2000});
                setInputValues({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    avatar: "",
                    gender: "",
                    password: "",
                });
              }
            } else {
              console.error("Error:", error.message);
              toast.error("An error occurred. Please try again.", {autoClose:2000});
              setInputValues({
                firstName: "",
                lastName: "",
                phone: "",
                avatar: "",
                gender: "",
                password: "",
              });
            }
        }
        
        
    };          
    
    return(
        <>
            <div className="">
                <div className="">
                    <div className="relative h-[130vh] w-full bg-cover bg-no-repeat bg-top" style={{backgroundImage: `url('${bgImg}')`}}>
                        <div className="py-2 px-4 flex flex-col h-full w-full bg-zinc-900 opacity-80 font-indie">
                            <div className="flex flex-row justify-end font-bold">
                               <Link to={"/services"} className="no-underline text-black">
                                    <div className="">
                                        <button className="text-black bg-green-400 px-3 py-1 rounded font-indie">Back</button>
                                    </div>
                               </Link>
                            </div>
                            <div className="flex justify-center mb-12 cursor-pointer" onClick={toHome}>
                                <p className="font-indie lg:text-3xl text-white text-xl animate-pulse"><u>Sunny Fresh</u></p>
                                <img src={logo} alt="logo" className="size-10" />
                            </div>
                            <form action="" onSubmit={handleCreate} className=" h-[90%]">
                                <div className="w-full h-fit flex flex-col mx-auto space-y-2">
                                    <div className="flex flex-col items-center">
                                        <input type="text" onChange={handleChange} name="firstName" value={inputValues.firstName} className="bg-white w-[30%] p-2 h-[60%] mx-auto rounded-lg" placeholder="Firstname" />
                                        {error.firstName && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.firstName}</p>}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <input type="text" onChange={handleChange} name="lastName" value={inputValues.lastName} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Lastname"/>
                                        {error.lastName && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.lastName}</p>}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <input type="text" onChange={handleChange} name="username" value={inputValues.username} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Username"/>
                                        {error.username && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.username}</p>}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <input type="text" onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })} name="email" value={inputValues.email} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Email" />
                                        {error.email && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.email}</p>}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <input type="text" onChange={(e) => setInputValues({ ...inputValues, avatar: e.target.value })} name="avatar" value={inputValues.avatar} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg bg-white" placeholder="Avatar" />
                                        {error.avatar && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.avatar}</p>}
                                    </div>
                                    <div className="flex flex-col items-center">
                                    <input type="text" onChange={(e) => setInputValues({ ...inputValues, phone: e.target.value })} name="phone" value={inputValues.phone} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg bg-white" placeholder="Phone" />
                                    {error.phone && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.phone}</p>}
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <select name="gender" onChange={handleChange} value={inputValues.gender} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" id="">
                                            <option value="">Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                        {error.gender && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.gender}</p>}
                                    </div>
                                    <div className="flex flex-col items-center">
                                    <input type="password" onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })} name="password" value={inputValues.password} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Password"/>
                                    {error.password && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.password}</p>}
                                    </div>                      
                                </div>
                                
                                <div className="mx-auto mt-5 w-[30%] flex gap-5">
                                    <button className="bg-yellow-600 text-white p-2 text-center rounded w-full">Submit</button>
                                </div>
                            </form>
                        </div>
                        <div className="fixed bottom-20 left-10 items-center font-indie text-white space-x-3">
                            <ul className="flex space-x-2">
                                <li className="cursor-pointer">Terms</li>
                                <li className="cursor-pointer">Privacy</li>
                                <li className="cursor-pointer">Jobs</li>
                                <li className="cursor-pointer">Support</li>
                            </ul>
                        </div>
                        <div className="fixed bottom-20 flex right-10 text-white space-x-2 font-indie">
                            <p>Posted by The Bald Baron</p>
                            <img className="rounded-full object-cover object-center size-5 items-center flex" src='https://ideogram.ai/assets/progressive-image/balanced/response/q0DBy_u3Q3KdBbIV3jgI3Q' alt="IMAGES" />
                        </div>
                    </div>
                    
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default UpdateCustomer;