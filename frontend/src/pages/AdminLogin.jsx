// App.js
import React, { useState } from "react";
import logo from "../PNG/household.png"
import image from "../PNG/ChE-mt3AQNacSntZ4kTcuA.webp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AdminLogin = () => {
  const [error, setError] = useState({});
  const navigate = useNavigate()
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const toDash = () =>{
    navigate("/login")
  }
 
const validateEmail = () => {
return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputValues.email);
};

const validatePassword = () => {
return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/.test(inputValues.password);
};

const formValidate = () => {
const newErrors = {};
if (inputValues.email.trim().length < 2) {
  newErrors.username = "Email cannot be empty";
}
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
    const { value, name } = e.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9kYXRhIjp7ImlkIjoiNjc4YTQ4ODZjNmJjNjA3NjQ0ZDg5MzEwIiwidXNlcm5hbWUiOiJCYXJuYWNsZSIsImVtYWlsIjoiYmFybmV5c0B5YWhvby5jb20uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTczNzExNTc4MywiZXhwIjoxNzM3MTE5MzgzfQ.2MaBvC2BknYBuu6K_9FlZOldHMlRYoWhjkkiiPkveCU"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!inputValues.email || !inputValues.password) {
          toast.warn("All fields must be filled!!", {autoClose:2000});
          return;
      }
      if(!formValidate()) return
        const resp = await axios.post(
            "http://localhost:5000/api/users/login/admin",
            inputValues,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (resp.data.success) {
            const loggedUser = resp.data.data;
            toast.success("Credentials Accepted!", {autoClose:2000});
            localStorage.setItem("laundry_admin", JSON.stringify(loggedUser));
            localStorage.setItem("authToken", token)
            navigate("/adminDash");
        }
    } catch (error) {
        if (error.response) {
            console.error("Error:", error.response.status);
            if (error.response.status === 403) {
                toast.warn("You do not have permission to access this resource.");
                setInputValues({                
                  email: "",
                  password: "",
              });
            }
            if(error.response.status === 401){
              toast.error("Invalid Credentials", {autoClose:2000})
              setInputValues({                
                email: "",
                password: "",
              });
            }
        } else {
            console.error("Error:", error.message);
            toast.error("An error occurred. Please try again.");
            setInputValues({                
              email: "",
              password: "",
          });
        }
    }
};   

  return (
    <div className="flex h-screen bg-white">
      <div className="lg:block w-1/2 bg-blue-500 flex items-center justify-center">
        <img
          src={image}
          alt="Placeholder"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mx-auto lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="flex items-end m-3">
          <p className="font-indie lg:text-3xl text-black text-xl">Sunny Fresh</p>
          <img src={logo} className="size-10" />
        </div>
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gradient-to-r from-red-950 via-red-900 to-red-950 relative">
          <form className="text-white font-indie" onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center">
                <label className="block">Email</label>
                {error.email && <p className="text-red-500 text-end text-sm mt-1 w-full mx-auto">{error.email}</p>}
              </div>
              <div className="flex flex-col items-center">
                <input type="text" className="font-sans w-full p-2 border text-black border-gray-300 rounded" name="email" value={inputValues.email || ""} onChange={handleChange}  placeholder="Email" />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <label className="block">Password</label>
                {error.password && <p className="text-red-500 text-end text-sm mt-1 w-full mx-auto">{error.password}</p>}
              </div>
              <div className="flex flex-col items-center">
                <input type="password" className="font-sans w-full p-2 border text-black border-gray-300 rounded" name="password" value={inputValues.password || ""} onChange={handleChange}  placeholder="Password" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit
              </button>
              <p className="bg-white text-black px-4 py-2 rounded hover:bg-red-900 hover:text-white border border-black font-indie" onClick={toDash}>
                Back
              </p>
              
            </div>
          </form>
        </div>
      </div>      
      <ToastContainer/>
    </div>
  );
};
export default AdminLogin;
