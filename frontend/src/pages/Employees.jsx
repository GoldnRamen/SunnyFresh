import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AllUsers from "../components/AllUsers";

import logo from "../PNG/household.png"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import img1 from "../PNG/2Ew7PvNYRceRcZ-aXf4LTA.webp"
import { MdEmail, MdOutlineCategory, MdSpaceDashboard } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosPeople, IoMdNotifications } from "react-icons/io";
import { GiBiceps, GiSoap } from "react-icons/gi";
import { LiaStoreAltSolid } from "react-icons/lia";
import { FaClipboardList, FaPlus, FaTools } from "react-icons/fa";
import { SiBlockbench } from "react-icons/si";
import { RiFirstAidKitFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { BiPhone } from "react-icons/bi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Employees = () => {
  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = loggedUser.id
  const adminFname = loggedUser.firstName
  const adminLname = loggedUser.lastName
  const [employeeData, setEmployeeData] = useState([]);
  const [seeOpns, setSeeOpns] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [employeeForm, setEmployeeForm] = useState(false);
  const [updateData, setUpdateData] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    avatar: "",
    department: "",
    gender: "",
    password: "",
  });

  const navigate = useNavigate()
  const opnsRef = useRef(null);
  
  const toHome = ()=>{
    navigate("/")
  }
  
  const toggleEmployeeForm = ()=>{
    setEmployeeForm(true)
  }

  useEffect(()=>{
    const handleOutClick = (event) => {
      if (opnsRef.current && !opnsRef.current.contains(event.target)){
        setSeeOpns({})
      }
    };
    document.addEventListener("mousedown", handleOutClick)
    return()=>{
      document.removeEventListener("mousedown", handleOutClick)
    }
  },[])

  useEffect(() => {
    const handleAllEmployees = async () => {
      try {
        if (!adminId) return; // Ensure adminId exists before making the request
  
        console.log("Admin ID:", adminId);
  
        const resp = await axios.get("http://localhost:5000/api/users/employee/all");
        console.log(resp.data);
        // toast.loading("Loading")
  
        setEmployeeData(resp.data.data.filter(user => user.role === "employee"))
  
        // Store token if available
        const token = resp.data.token;
        if (token) {
          localStorage.setItem("adminToken", token);
        }
  
        // Corrected status check
        if (resp.data.status !== 200) {
          console.log("Data not found");
        }
  
      } catch (error) {
        setError(error.message);
        console.error("Error fetching all employees:", error.response?.data || error.message);
        toast.error("Trouble loading details");
      }
    };
  
    handleAllEmployees();
  }, [adminId]); // Runs whenever adminId changes

const handleChange = (e) => {
const { value, name } = e.target;
setInputValues((prevState) => ({
...prevState,
[name]: value,
}));
};

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9kYXRhIjp7ImlkIjoiNjc4YmFkNjIwMzRmYjM1YTBhZTdjMzcyIiwidXNlcm5hbWUiOiJDYXB0YWluIiwiZW1haWwiOiJyb2dlcnNzdGV2ZXNAeWFob28uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTczNzIwNzEzOCwiZXhwIjoxNzM3MjkzNTM4fQ.HD0D7TsFds7Mp4_rRd7ax12EdfKP4JnFC0rw__srHQ8"

const handleUpdate = async (e) => {
  e.preventDefault();
  
  // Validation logic
  const newErrors = {};
  
  // Basic validation for required fields
  if (!inputValues.firstName || inputValues.firstName.trim().length < 2) {
    newErrors.firstName = "First name must be at least 2 characters long";
  }
  if (!inputValues.lastName || inputValues.lastName.trim().length < 2) {
    newErrors.lastName = "Last name must be at least 2 characters long";
  }
  if (!inputValues.username || inputValues.username.trim().length < 2) {
    newErrors.username = "Username must be at least 2 characters long";
  }
  
  // Email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!inputValues.email) {
    newErrors.email = "Email is required";
  } else if (!emailPattern.test(inputValues.email)) {
    newErrors.email = "Invalid email address";
  }
  
  // Avatar URL validation
  const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)(\?.*)?)|^(https?:\/\/.*\/.*)$/;
  if (!inputValues.avatar) {
    newErrors.avatar = "Image URL is required";
  } else if (!urlPattern.test(inputValues.avatar)) {
    newErrors.avatar = "Invalid image URL format";
  }
  
  // Phone validation
  const phonePattern = /^[0-9]+$/;
  if (!inputValues.phone) {
    newErrors.phone = "Phone number is required";
  } else if (!phonePattern.test(inputValues.phone)) {
    newErrors.phone = "Invalid phone number";
  }
  
  // Department validation
  if (!inputValues.department) {
    newErrors.department = "Department selection is required";
  }
  
  // Gender validation
  if (!inputValues.gender) {
    newErrors.gender = "Gender selection is required";
  }
  
  // Password validation - ONLY if password field is not empty
  if (inputValues.password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,8}$/;
    if (!passwordPattern.test(inputValues.password)) {
      newErrors.password =
        "Password must be 4-8 characters, include at least one uppercase letter, one lowercase letter, and one number";
    }
  }
  
  if (Object.keys(newErrors).length > 0) {
    setError(newErrors);
    return;
  }
  
  // Create a copy of inputValues without password if it's empty
  const dataToUpdate = {...inputValues};
  if (!dataToUpdate.password) {
    delete dataToUpdate.password;
  }
  
  try {
    const resp = await axios.put(
      `http://localhost:5000/api/users/employee/edit/${editingEmployeeId}`,
      dataToUpdate
    );

    if (resp.data.success) {
      // Successfully updated employee data in the database
      toast.success("Employee details updated successfully!");

      // Update the employeeData state to reflect changes without reloading the page
      setEmployeeData((prevState) =>
        prevState.map((employee) =>
          employee._id === editingEmployeeId ? { ...employee, ...dataToUpdate } : employee
        )
      );
      setEditingEmployeeId(null);

      // Clear the form fields after successful submission
      setInputValues({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        avatar: "",
        department: "",
        gender: "",
        password: "",
      });
    } else {
      toast.error("Something went wrong while updating!");
    }
  } catch (error) {
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
      // if (!inputValues.department) {
      //   newErrors.department = "Department selection is required";
      // }
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
      const resp = await axios.post(
        `http://localhost:5000/api/users/register/employee`,
        inputValues
      );

      if (resp.data.success) {
        toast.success("Employee created successfully!");
        setEmployeeData((prevState) => !prevState);
        setEmployeeForm((prevState) => !prevState);
        setInputValues({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phone: "",
          avatar: "",
          department: "",
          gender: "",
          password: "",
        });
      } else {
        toast.error("Something went wrong while updating!");
        alert("Something went wrong");
      }
    } catch (error) {
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

const handleDelete = async(employeeId) =>{
  try {
    if (!employeeId) {
      toast.error("Invalid Employee ID");
      return;
    }
    const response = await axios.delete( `http://localhost:5000/api/users/employee/remove/${employeeId}`)
    if(response.data.success){
      toast.success("Employee Deleted Successfully", {autoClose:2000})
      setDeleteData(false)
      setSeeOpns(false)
    }
    else{
      toast.error("Failed to delete Employee", {autoClose:2000})
    }
  } catch (error) {
    console.error("Error:", error.message);
        toast.error("An error occurred. Please try again.", {autoClose:2000});
  }
}

const toggleOpns = (employeeId) => {
  setSeeOpns((prev) => ({
    ...prev,
    [employeeId]: !prev[employeeId], // Toggle specific customer's options
  }));
};

  const updateEmployee = ()=>{
    setUpdateData(true)
  }
  const onClose =()=>{
    setUpdateData(false)
    setDeleteData(false)
    setEditingEmployeeId(false)
    setSeeOpns(false)
    setEmployeeForm(false)
  }

  const toggleDelete = ()=>{
    setDeleteData(true)
  }

  const startEditing = (employee) => {
    // Populate the form with the employee's current data
    setInputValues({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      username: employee.username || "",
      email: employee.email || "",
      phone: employee.phone || "",
      avatar: employee.avatar || "",
      department: employee.department || "",
      gender: employee.gender || "",
      password: "", // Leave password empty for security
    });
    
    // Set the editing state to this employee's ID
    setEditingEmployeeId(employee._id);
    
    // Clear any previous errors
    setError({});
  };

  return (
    <>
    <div className="bg-orange-100">
       
      <div className="mt-[8%]">
        
        <div className="mt-20">
        <div className="fixed left-0 w-[250px] top-2 p-1 border-r border rounded shadow-slate-700 shadow-lg h-fit bg-orange-300" >
            <div className="flex items-end mb-12 cursor-pointer" onClick={toHome}>
              <p className="font-indie lg:text-3xl text-black text-xl animate-pulse"><u>Sunny Fresh</u></p>
              <img src={logo} className="size-10" />
            </div>
            <div className="overflow-y-scroll scrollbar-thin scrollbar-track-transparent h-[80vh] scrollbar-thumb-orange-800 relative">
              <div className="">
                <Link to="/adminDash" className="no-underline text-orange-950">
                  <p className="p-2 text-sm border-b-orange-800 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <MdSpaceDashboard className="text-white"/>Dashboard
                  </p>
                </Link>
                <Link to="/inbox" className="no-underline text-orange-950">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <HiMiniInboxArrowDown className="text-white"/>Inbox
                  </p>
                </Link>
                <Link to="/leaveManagement" className="no-underline text-orange-950">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <AiFillSchedule className="text-white"/>Schedule
                  </p>
                </Link>
              </div>
              <hr className="h-1 border-gray-800"/>
              {/* <p className="p-3 text-sm font-bold text-gray-800 border-b-orange-300">
                  PERSONNEL
              </p> */}
              <div className="">
                <Link to="/customers" className="no-underline text-orange-950">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <IoIosPeople className="text-white"/>Customers
                  </p>
                </Link>  
                <Link to="/employees" className="no-underline text-black">
                  <p className="p-2 text-sm border-b-2 border-b-black cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center bg-white">
                  <GiBiceps className="text-orange-400"/>Employees
                  </p>
                </Link>  
                <Link to="/suppliers" className="no-underline text-orange-950">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <LiaStoreAltSolid className="text-white"/>Suppliers
                  </p>
                </Link>  
              </div>
              <hr className="h-1 border-gray-800"/>
              <Link to="/inventory">
                <p className="p-2 text-sm text-orange-950 font-bold cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                <MdOutlineInventory />INVENTORY
                </p>
              </Link>
              <Link to="/login" className="no-underline text-orange-950">
                <p className="p-3 cursor-pointer font-bold hover:shadow-black hover:shadow">
                    Logout
                </p>
              </Link>
            </div>
            
          </div>
          {employeeForm && (
                <div className="w-[80%] h-[85%] bg-black opacity-95 z-50 fixed top-20 right-5">
                <p className="text-center mt-2 text-white">Employee Registeration Form</p>
                <form action="" onSubmit={handleCreate} className=" h-[90%] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-yellow-600">
                  <div className="w-full h-fit flex flex-col mx-auto mt-8 space-y-2">
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
                        <select name="department" onChange={handleChange} value={inputValues.department} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" id="">
                            <option value="">Department</option>
                            <option value="Stain Removal">Stain Removal</option>
                            <option value="Dry-Cleaning">Dry-Cleaning</option>
                            <option value="Ironing">Ironing</option>
                            <option value="Laundry">Laundry</option>
                            <option value="Delivery">Delivery</option>
                        </select>
                        {error.department && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.department}</p>}
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
                      <p onClick={onClose} className="text-white text-center flex p-3 border w-fit rounded cursor-pointer">Close</p>
                  </div>
                </form>
              </div>
              )}
          <div className="flex fixed flex-col w-full h-[10vh] bg-white top-0 left-[20%] mx-auto border shadow-slate-700 shadow-lg p-3">
            <div className="relative h-fit w-fit flex items-center m-2">
              <p className="font-indie font-bold">Employees</p>
              <div className="fixed flex items-center gap-3 right-5">
                <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                <Link to="/adminDash" className="my-auto text-center">
                  <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                </Link>
                <p className="text-xs">{adminFname}&nbsp;{adminLname}</p>
              </div>
            </div>
          </div>
          <div className="mt-[10vh] ml-[20%]">
            <div className="flex justify-between p-1">
           
              {employeeData.length && (
                <p className="text-2xl font-semibold flex gap-1"><p className="text-green-950">{employeeData.length}</p> Employee(s)</p>
              )}
              <div className="flex-col flex gap-1">
                <div className="p-2 text-center w-full items-center flex cursor-pointer h-fit rounded-lg bg-orange-800 text-white relative group">
                  <FaPlus className="text-white size-3"  onClick={toggleEmployeeForm}/>
                  <div className="absolute -bottom-[40%] right-7 transform -translate-y-1/2 translate-x-[-8px] px-1 py-1 bg-orange-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity w-fit">
                      Add&nbsp;Employee
                  </div>
                </div>
                <div className="p-2 text-center w-full items-center flex cursor-pointer h-fit rounded-lg bg-orange-800 text-white relative group">
                  <MdOutlineCategory className="text-white size-3" />
                  <div className="absolute -bottom-[40%] right-7 transform -translate-y-1/2 translate-x-[-8px] px-1 py-1 bg-orange-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Departments
                  </div>
                </div>
              </div>
            </div>
            <div className="gap-2 grid grid-cols-3 p-3"> {/* gap here is used till the api supplies the data */}
            {employeeData && employeeData.length > 0 ? (
            [...employeeData]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by latest first
                .map((employee) => (
                  <div className="bg-orange-300 flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" key={employee._id}>
                     {editingEmployeeId === employee._id && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg shadow-xl w-[80%] max-w-4xl max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center">
                              <h2 className="text-xl font-semibold">Update Employee Information</h2>
                              <button 
                                onClick={() => {
                                  setEditingEmployeeId(null);
                                  setInputValues({
                                    firstName: "",
                                    lastName: "",
                                    username: "",
                                    email: "",
                                    phone: "",
                                    avatar: "",
                                    department: "",
                                    gender: "",
                                    password: "",
                                  });
                                  setError({});
                                }}
                                className="text-white hover:text-gray-200 text-xl"
                              >
                                ✕
                              </button>
                            </div>
                            
                            {/* Form Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                              <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* First Column */}
                                  <div className="space-y-4">
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">First Name</label>
                                      <input 
                                        type="text" 
                                        name="firstName" 
                                        value={inputValues.firstName} 
                                        onChange={handleChange}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        placeholder="First Name" 
                                      />
                                      {error.firstName && <p className="text-red-500 text-xs mt-1">{error.firstName}</p>}
                                    </div>
                                    
                                    {/* Last Name */}
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">Last Name</label>
                                      <input 
                                        type="text" 
                                        name="lastName" 
                                        value={inputValues.lastName} 
                                        onChange={handleChange}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        placeholder="Last Name" 
                                      />
                                      {error.lastName && <p className="text-red-500 text-xs mt-1">{error.lastName}</p>}
                                    </div>
                                    
                                    {/* Username */}
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">Username</label>
                                      <input 
                                        type="text" 
                                        name="username" 
                                        value={inputValues.username} 
                                        onChange={handleChange}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        placeholder="Username" 
                                      />
                                      {error.username && <p className="text-red-500 text-xs mt-1">{error.username}</p>}
                                    </div>
                                  </div>
                                  
                                  {/* Second Column */}
                                  <div className="space-y-4">
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">Email</label>
                                      <input 
                                        type="email" 
                                        name="email" 
                                        value={inputValues.email} 
                                        onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        placeholder="Email" 
                                      />
                                      {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
                                    </div>
                                    
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">Phone</label>
                                      <input 
                                        type="text" 
                                        name="phone" 
                                        value={inputValues.phone} 
                                        onChange={(e) => setInputValues({ ...inputValues, phone: e.target.value })}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        placeholder="Phone Number" 
                                      />
                                      {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
                                    </div>
                                    
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">Department</label>
                                      <select 
                                        name="department" 
                                        value={inputValues.department} 
                                        onChange={handleChange}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                      >
                                        <option value="">Select Department</option>
                                        <option value="Laundry">Laundry</option>
                                        <option value="Stain Removal">Stain Removal</option>
                                        <option value="Dry-Cleaning">Dry-Cleaning</option>
                                        <option value="Ironing">Ironing</option>
                                        <option value="Delivery">Delivery</option>
                                      </select>
                                      {error.department && <p className="text-red-500 text-xs mt-1">{error.department}</p>}
                                    </div>
                                  </div>
                                  
                                  {/* Third Column */}
                                  <div className="space-y-4">
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">Gender</label>
                                      <select 
                                        name="gender" 
                                        value={inputValues.gender} 
                                        onChange={handleChange}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                      >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                      </select>
                                      {error.gender && <p className="text-red-500 text-xs mt-1">{error.gender}</p>}
                                    </div>
                                    
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">
                                        Password <span className="text-gray-400 text-xs">(Optional - leave blank to keep current)</span>
                                      </label>
                                      <input 
                                        type="password" 
                                        name="password" 
                                        value={inputValues.password} 
                                        onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        placeholder="New password (optional)" 
                                      />
                                      {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                                    </div>
                                    
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="block text-white text-sm font-semibold mb-2">Avatar URL</label>
                                      <input 
                                        type="text" 
                                        name="avatar" 
                                        value={inputValues.avatar} 
                                        onChange={(e) => setInputValues({ ...inputValues, avatar: e.target.value })}
                                        className="rounded-lg p-2 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        placeholder="Avatar URL" 
                                      />
                                      {error.avatar && <p className="text-red-500 text-xs mt-1">{error.avatar}</p>}
                                      
                                      {/* Avatar Preview */}
                                      {inputValues.avatar && (
                                        <div className="mt-4 flex items-center justify-center">
                                          <img 
                                            src={inputValues.avatar} 
                                            alt="Avatar Preview" 
                                            className="h-24 w-24 object-cover rounded-full border-2 border-orange-300"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex justify-center gap-4 items-center mt-6 pt-4 border-t border-gray-700">
                                  <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
                                  >
                                    Update Employee
                                  </button>
                                  
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setEditingEmployeeId(null);
                                      setInputValues({
                                        firstName: "",
                                        lastName: "",
                                        username: "",
                                        email: "",
                                        phone: "",
                                        avatar: "",
                                        department: "",
                                        gender: "",
                                        password: "",
                                      });
                                      setError({});
                                    }}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                      {deleteData === employee._id && (
                        <div className="w-[80%] h-[100%] bg-black opacity-90 z-50 fixed right-0 top-20" ref={opnsRef}>
                          <div className="mt-[15vh] flex flex-col relative">
                            <p className="text-white text-center">Are you sure you want to delete this employee's data? Action is <strong className="text-red-700">irreversible!!</strong></p>
                            <div className="flex gap-5 mx-auto mt-10 items-center">
                              <button onClick={()=>handleDelete(employee._id)} className="bg-red-500 border-2 border-black hover:border-red-800 hover:text-red-950 hover:animate-pulse text-white font-semibold rounded-lg p-2 w-fit h-fit">Delete</button>
                              <button className="rounded-lg p-2 w-fit h-fit border mx-auto text-white" onClick={onClose}>Close</button>
                            </div>
                          </div>
                        </div>
                      )}
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <img src={employee.avatar} className="size-20 border rounded-full border-white object-cover object-top" alt="IMAGES" />
                        <BsThreeDots onClick={()=> toggleOpns(employee._id)}/>
                        {seeOpns[employee._id] && (
                          <div className="flex flex-col rounded-lg bg-white absolute top-20 right-5" ref={opnsRef}>
                            <ul>
                              <li className="border-b p-2 cursor-pointer" onClick={() => startEditing(employee)}>Update Info</li>
                              <li className="text-red-700 p-2 cursor-pointer" onClick={() => setDeleteData(employee._id)}>Delete Info</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold">Name: {employee.firstName} {employee.lastName}</p>
                        <p className="text-sm">Username: {employee.username}</p>
                      </div>
                    </div>
                    <div className="p-2 mt-4 rounded-lg bg-orange-200 font-semibold">
                      <div className="flex justify-between items-center text-gray-600">
                        <p className="text-sm">Department</p>
                        <p className="text-sm">Hired Date</p>
                      </div>
                      <div className="flex justify-between items-center font-semibold">
                        <p className="text-sm">{employee.department}</p>
                        <p className="text-sm">{employee.createdAt.split("T")[0]}</p>
                      </div>
                      <div className="mt-4">
                        <p className="mb-2 font-semibold">Contact Info:</p>
                        <p className="flex items-center gap-3"><MdEmail />{employee.email}</p>
                        <p className="flex items-center gap-3"><BiPhone />{employee.phone}</p>
                      </div>
                    </div>
                  </div>  
                ))
              ): (
                "No Employee Found"
              )}
              
              
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};
export default Employees;
