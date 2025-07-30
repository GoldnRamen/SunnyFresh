// App.js
import React, { useState } from "react";
import logo from "../PNG/household.png"
import image from "../PNG/2Ew7PvNYRceRcZ-aXf4LTA.webp";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const EmployeeLogin = () => {
  const [error, setError] = useState({})
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
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/.test(inputValues.password);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!inputValues.email || !inputValues.password) {
        toast.warn("All fields must be filled!!", {autoClose:2000});
        return;
      }
      if(!formValidate()) return
        const resp = await axios.post(
            "http://localhost:5000/api/users/login/employee",
            inputValues
        );
        const loggedUser = resp.data.data;
        if (loggedUser.role === "employee") {
          setInputValues({
              email: "",
              password: "",
          });
          localStorage.setItem("laundry_employee_loggedUser", JSON.stringify(loggedUser))
          toast.success("Credentials Accepted!", {autoClose:2000});
          console.log(loggedUser);
          navigate("/employeeDash")
        }
        else if(loggedUser.role !== "employee"){
          toast.warn("Invalid User Path", {autoClose:2000})
          setInputValues({
            email: "",
            password: "",
        });
        }
        
    } catch (error) {
        if (error.response) {
            console.error("Error:", error.response.status);
            if (error.response.status === 403) {
                toast.warn("You do not have permission to access this resource.", {autoClose:2000});
                setInputValues({
                  email: "",
                  password: "",
              });
            if(error.response.status === 401){
              toast.error("Invalid Credentials", {autoClose:2000})
              setInputValues({                
                email: "",
                password: "",
              });
            }
            }
        } else {
            console.error("Error:", error.message);
            toast.error("An error occurred. Please try again.", {autoClose:2000});
            setInputValues({
              email: "",
              password: "",
          });
        }
    }
}; 

  return (
    <>
    <div className="flex h-screen bg-gray-100">
      <div className="lg:block w-1/2 bg-blue-500 flex items-center justify-center">
        <img
          src={image}
          alt="Placeholder"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mx-auto lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500">
        <div className="flex items-end m-3">
          <p className="font-indie lg:text-3xl text-black text-xl">Sunny Fresh</p>
          <img src={logo} className="size-10" />
        </div>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border-2 border-blue-950 relative">
          <h2 className="text-2xl text-center font-bold mb-4">
            <p className="font-saira text-blue-900 underline">Login</p>
          </h2>
          <form className="font-indie" onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center">
                <label className="block">Email</label>
                {error.email && <p className="text-red-500 text-end text-sm mt-1 w-full mx-auto">{error.email}</p>}
              </div>
              <div className="flex flex-col items-center">
                <input type="text" className="w-full p-2 border text-black border-gray-300 rounded" name="email" value={inputValues.email || ""} onChange={handleChange}  placeholder="Email" />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <label className="block">Password</label>
                {error.password && <p className="text-red-500 text-end text-sm mt-1 w-full mx-auto">{error.password}</p>}
              </div>
              <div className="flex flex-col items-center">
                <input type="password" className="w-full p-2 border text-black border-gray-300 rounded" name="password" value={inputValues.password || ""} onChange={handleChange}  placeholder="Password" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit
              </button>
            </div>
          </form>
          <button 
            className="bg-white text-black px-4 py-2 rounded hover:bg-blue-900 hover:text-white absolute right-10 bottom-5 border border-blue-900 font-indie"
            onClick={toDash}
          >Back
          </button>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  );
};
export default EmployeeLogin;
