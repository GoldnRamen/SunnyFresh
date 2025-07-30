import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AllUsers from "../components/AllUsers";

import logo from "../PNG/household.png"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
// import img1 from "../PNG/2Ew7PvNYRceRcZ-aXf4LTA.webp"
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
import { toast } from "react-toastify";

const Customers = () => {
  // const {userId} = useParams()
  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = loggedUser.id
  const adminFname = loggedUser.firstName
  const adminLname = loggedUser.lastName
  const [error, setError] = useState({})
  const [customerForm, setCustomerForm] = useState(false)
  const [customerData, setCustomerData] = useState([]);
  const [seeOpns, setSeeOpns] = useState({});
  const [updateData, setUpdateData] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const opnsRef = useRef(null);
  const navigate = useNavigate()

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
  const validateEmail = () => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputValues.email);
  };

  const validatePassword = () => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/.test(inputValues.password);
  };
  const validatePhone = () => {
  return /^\d{10,15}$/.test(inputValues.phone);
  };
  const validateAvatar = () => {
  return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(inputValues.avatar);
  };


  const formValidate = () => {
    const newErrors = {};
    if (inputValues.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters long";
    }
    if (inputValues.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters long";
    }
    if (inputValues.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters long";
    }
    if (inputValues.email.trim().length < 2) {
      newErrors.username = "Email cannot be empty";
    }
    if (!inputValues.avatar) {
      newErrors.avatar = "Image is required!";
    }
    if (!validateEmail()) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePhone()) {
      newErrors.phone = "Invalid phone number";
    }       
    if (!validateAvatar()) {
      newErrors.avatar = "Invalid Image format";
    }       
    
    // Only validate password if it's provided (for updates)
    if (inputValues.password && !validatePassword()) {
      newErrors.password =
        "Password must be 4-8 characters long, include at least one uppercase letter, one lowercase letter, and one number";
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
  const { value, name } = e.target;
  setInputValues((prevState) => ({
  ...prevState,
  [name]: value,
  }));
  };

  const handleUpdate = async (e, customerId) => {
    e.preventDefault();
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
        `http://localhost:5000/api/users/customer/edit/${customerId}`,
        dataToUpdate
      );

      if (resp.data.success) {
        toast.success("Customer details updated successfully!", {autoClose:2000});
        setCustomerData((prevState) =>
          prevState.map((customer) =>
            customer._id === customerId ? { ...customer, ...dataToUpdate } : customer
          )
        );

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
        setEditingCustomerId(null);
      } else {
        toast.error("Something went wrong while updating!", {autoClose:2000});
      }
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.status);
        if (error.response.status === 403) {
          toast.warn("You do not have permission to access this resource.", {autoClose:2000});
        }
      } else {
        console.error("Error:", error.message);
        toast.error("An error occurred. Please try again.", {autoClose:2000});
      }
    }
  };
    
  const handleCreate = async(e) => {
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
        const resp = await axios.post(
          `http://localhost:5000/api/users/register`,
          inputValues
        );
  
        if (resp.data.success) {
          toast.success("Customer created successfully!", {autoClose:2000});
          setCustomerData((prevState) => !prevState);
          setCustomerForm((prevState) => !prevState);
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
        } else {
          toast.error("Something went wrong while updating!", {autoClose:2000});
          alert("Something went wrong");
        }
      } catch (error) {
        if (error.response) {
          console.error("Error:", error.response.status);
          if (error.response.status === 403) {
            toast.warn("You do not have permission to access this resource.", {autoClose:2000});
          }
        } else {
          console.error("Error:", error.message);
          toast.error("An error occurred. Please try again.", {autoClose:2000});
        }
      }      
  };

  const handleDelete = async(customerId) =>{
    try {
      if (!customerId) {
        toast.error("Invalid customer ID");
        return;
      }
      const response = await axios.delete( `http://localhost:5000/api/users/customer/remove/${customerId}`)
      if(response.data.success){
        toast.success("Customer Deleted Successfully", {autoClose:2000})
        setDeleteData(false)
        setSeeOpns(false)
      }
      else{
        toast.error("Failed to delete Customer", {autoClose:2000})
      }
    } catch (error) {
      console.error("Error:", error.message);
          toast.error("An error occurred. Please try again.", {autoClose:2000});
    }
  }
  
  const toggleCustomerForm = ()=>{
    setCustomerForm(true)
  }
  const toHome = ()=>{
    navigate("/")
  }

  useEffect(() => {
    const handleOutClick = (event) => {
      if (opnsRef.current && !opnsRef.current.contains(event.target)){
        setSeeOpns({})
      }
    };
  
    document.addEventListener("mousedown", handleOutClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
      setShowOrderHistory(false);
    };
  }, []); // Only runs once when the component mounts
  
  useEffect(() => {
    const handleAllCustomers = async () => {
      try {
        if (!adminId) return(toast.error("Admin Details Not Found!")); // Ensure adminId exists before making the request
  
        console.log("Admin ID:", adminId);
        
        const resp = await axios.get("http://localhost:5000/api/users/customer/all");
        console.log(resp.data);  
        setCustomerData(resp.data.data.filter(user => user.role === "customer"))

        const token = resp.data.token;
        if (token) {
          localStorage.setItem("adminToken", token);
        }

        if (resp.data.status !== 200) {
          console.log("Data not found");
        }
  
      } catch (error) {
        setError(error.message);
        console.error("Error fetching all customers:", error.response?.data || error.message);
        toast.error("Trouble loading details", {autoClose:2000});
      }
    };
  
    handleAllCustomers();
  }, [adminId]);
  

  const toggleOpns = (customerId) => {
    setSeeOpns((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };
  

  const onClose = () => {
    setUpdateData(false);
    setInputValues({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      avatar: "",
      gender: "",
      password: ""
    });
    setError({});
    setDeleteData(null);
    setCustomerForm(false);
    setEditingCustomerId(null);
    setSeeOpns({});
  }

  const toggleDelete = ()=>{
    setDeleteData(true)
  }

  const handleViewOrders = async (customerId, customerName) => {
    try {
      const resp = await axios.get("http://localhost:5000/api/orders/all");
      const customerOrders = resp.data.data.filter(
        order => order.userId._id === customerId
      );
      setSelectedCustomerOrders(customerOrders);
      setSelectedCustomer(customerName);
      setShowOrderHistory(true);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      toast.error("Error loading customer orders", {autoClose:2000});
    }
  };

  const startEditing = (customer) => {
    setInputValues({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      username: customer.username || "",
      email: customer.email || "",
      phone: customer.phone || "",
      avatar: customer.avatar || "",
      gender: customer.gender || "",
      password: "", // Always empty for security
    });
    setEditingCustomerId(customer._id);
  };

  return (
    <>
    <div className="bg-green-200 w-full h-full z-50">
      
        
      <div className="mt-[8%]">
        
        <div className="mt-20">
        <div className="fixed left-0 w-[250px] top-2 p-1 border-r border rounded shadow-slate-700 shadow-lg h-fit bg-green-800" >
            <div className="flex items-end mb-12 cursor-pointer" onClick={toHome}>
              <p className="font-indie lg:text-3xl text-white text-xl animate-pulse"><u>Sunny Fresh</u></p>
              <img src={logo} className="size-10" />
            </div>
            <div className="overflow-y-scroll scrollbar-thin scrollbar-track-transparent h-[80vh] scrollbar-thumb-green-950 relative">
              <div className="">
                <Link to="/adminDash" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-orange-800 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <MdSpaceDashboard className="text-white"/>Dashboard
                  </p>
                </Link>
                <Link to="/inbox" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <HiMiniInboxArrowDown className="text-white"/>Inbox
                  </p>
                </Link>
                <Link to="/leaveManagement" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <AiFillSchedule className="text-white"/>Schedule
                  </p>
                </Link>
              </div>
              <hr className="h-1 border-gray-800"/>
              {/* <p className="p-3 text-sm font-bold text-gray-300 border-b-orange-300">
                  PERSONNEL
              </p> */}
              <div className="">
                 
                <Link to="/customers" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-2 border-b-black cursor-pointer text-green-800 hover:shadow-black hover:shadow flex gap-1 items-center bg-white">
                  <IoIosPeople className="text-green-800"/>Customers
                  </p>
                </Link> 
                <Link to="/employees" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <GiBiceps className="text-white"/>Employees
                  </p>
                </Link>  
                <Link to="/suppliers" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <LiaStoreAltSolid className="text-white"/>Suppliers
                  </p>
                </Link>  
              </div>
              <hr className="h-1 border-gray-800"/>
              <Link to="/inventory">
                <p className="p-2 text-sm text-gray-300 font-bold cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                <MdOutlineInventory />INVENTORY
                </p>
              </Link>
              <Link to="/login" className="no-underline text-black">
                <p className="p-3 cursor-pointer text-gray-300 font-bold hover:shadow-black hover:shadow">
                    Logout
                </p>
              </Link>
            </div>
            
          </div>
          <div className="flex fixed flex-col w-full h-[10vh] bg-white top-0 left-[20%] mx-auto border shadow-slate-700 shadow-lg p-3 z-50">
            <div className="relative h-fit w-fit flex items-center m-2">
              <p className="font-indie font-bold">Customers</p>
              <div className="fixed flex items-center gap-3 right-5">
                <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                <Link to="/adminDash" className="my-auto text-center">
                  <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                </Link>
                <p className="text-xs">{adminFname}&nbsp;{adminLname}</p>
              </div>
            </div>
          </div>
          <div className="fixed z-10 top-0">
 
                  </div>
          <div className="mt-[10vh] ml-[20%]">
            <div className="flex justify-between p-1 relative">
            {customerForm && (
              <div className="w-[80%] h-[85%] bg-black opacity-95 z-50 fixed top-20 right-5">
                <p className="text-center mt-2 text-white">Customer Registeration Form</p>
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
            {customerData.length && (
              <p className="text-2xl font-semibold flex gap-1"><p className="text-green-950">{customerData.length}</p> Customer(s)</p>
            )}
              <div className="flex-col flex gap-1">
                <div className="p-2 text-center w-full items-center flex cursor-pointer h-fit rounded-lg bg-green-900 text-white relative group">
                  <FaPlus onClick={toggleCustomerForm} className="text-white size-3" />
                  <div className="absolute -bottom-[40%] right-7 transform -translate-y-1/2 translate-x-[-8px] px-1 py-1 bg-green-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity w-fit">
                      Add&nbsp;Customer
                  </div>
                </div>
                <div className="p-2 text-center w-full items-center flex cursor-pointer h-fit rounded-lg bg-green-900 text-white relative group">
                  <MdOutlineCategory className="text-white size-3" />
                  <div className="absolute -bottom-[40%] right-7 transform -translate-y-1/2 translate-x-[-8px] px-1 py-1 bg-green-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Patron&nbsp;Store
                  </div>
                </div>
              </div>
            </div>
            <div className="gap-2 grid grid-cols-3 p-3"> {/* gap here is used till the api supplies the data */}
            {customerData && customerData.length > 0 ? (
              [...customerData]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by latest first
                .map((customer) => (
                  <div 
                    className="bg-green-800 flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" 
                    key={customer._id}
                  >
                      {editingCustomerId === customer._id && (
                        <div className="fixed left-[260px] w-full h-[100vh] top-0 z-10 bg-black opacity-90 p-6 rounded shadow-lg text-center">
                          <div className="mt-[10vh] flex flex-col relative">
                            <form className="mx-auto flex flex-col gap-2 w-full max-w-4xl" onSubmit={(e) => handleUpdate(e, customer._id)}>
                              {/* Header Section */}
                              <div className="bg-green-800 p-4 rounded-t-lg">
                                <h2 className="text-white text-xl font-bold text-center">Update Customer Details</h2>
                              </div>
                              
                              {/* Main Content - 3 Grid Layout */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800 bg-opacity-50">
                                {/* First Column */}
                                <div className="space-y-4">
                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">First Name</label>
                                    <input 
                                      type="text" 
                                      name="firstName"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.firstName}
                                      onChange={handleChange}
                                    />
                                    {error.firstName && <p className="text-red-500 text-xs mt-1">{error.firstName}</p>}
                                  </div>
                                  
                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">Last Name</label>
                                    <input 
                                      type="text" 
                                      name="lastName"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.lastName}
                                      onChange={handleChange}
                                    />
                                    {error.lastName && <p className="text-red-500 text-xs mt-1">{error.lastName}</p>}
                                  </div>

                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">Username</label>
                                    <input 
                                      type="text" 
                                      name="username"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.username}
                                      onChange={handleChange}
                                    />
                                    {error.username && <p className="text-red-500 text-xs mt-1">{error.username}</p>}
                                  </div>
                                </div>
                                
                                {/* Second Column */}
                                <div className="space-y-4">
                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">Email</label>
                                    <input 
                                      type="email" 
                                      name="email"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.email}
                                      onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })}
                                    />
                                    {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
                                  </div>
                                  
                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">Phone</label>
                                    <input 
                                      type="text" 
                                      name="phone"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.phone}
                                      onChange={(e) => setInputValues({ ...inputValues, phone: e.target.value })}
                                    />
                                    {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
                                  </div>
                                  
                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">Gender</label>
                                    <select 
                                      name="gender"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.gender}
                                      onChange={handleChange}
                                    >
                                      <option value="">Select Gender</option>
                                      <option value="male">Male</option>
                                      <option value="female">Female</option>
                                    </select>
                                    {error.gender && <p className="text-red-500 text-xs mt-1">{error.gender}</p>}
                                  </div>
                                </div>
                                
                                {/* Third Column */}
                                <div className="space-y-4">
                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">Avatar URL</label>
                                    <input 
                                      type="text" 
                                      name="avatar"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.avatar}
                                      onChange={(e) => setInputValues({ ...inputValues, avatar: e.target.value })}
                                    />
                                    {error.avatar && <p className="text-red-500 text-xs mt-1">{error.avatar}</p>}
                                  </div>
                                  
                                  <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                    <label className="text-white text-left text-sm font-semibold mb-2 block">
                                      Password <span className="text-gray-400 text-xs">(Optional - leave blank to keep current password)</span>
                                    </label>
                                    <input 
                                      type="password" 
                                      name="password"
                                      className="rounded-lg p-2 w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                                      value={inputValues.password}
                                      onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })}
                                      placeholder="Enter new password only if changing"
                                    />
                                    {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                                  </div>
                                  
                                  {/* Avatar Preview */}
                                  {inputValues.avatar && (
                                    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                      <label className="text-white text-left text-sm font-semibold mb-2 block">Avatar Preview</label>
                                      <div className="flex justify-center">
                                        <img 
                                          src={inputValues.avatar} 
                                          alt="Avatar Preview" 
                                          className="h-24 w-24 object-cover rounded-full border-2 border-green-300"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Footer with Actions */}
                              <div className="flex justify-center gap-4 items-center mt-4 p-4 bg-gray-800 bg-opacity-50 rounded-b-lg">
                                <button 
                                  type="submit" 
                                  className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors"
                                >
                                  Update Customer
                                </button>
                                
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setEditingCustomerId(null);
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
                      )}
                      {deleteData === customer._id && (
                        <div className="w-[80%] h-[100%] bg-black opacity-90 z-50 fixed right-0 top-20" ref={opnsRef}>
                          <div className="mt-[15vh] flex flex-col relative">
                            <p className="text-white text-center">Are you sure you want to delete this customer's data? Action is <strong className="text-red-700">irreversible!!</strong></p>
                            <div className="flex gap-5 mx-auto mt-10 items-center">
                              <button onClick={()=>handleDelete(customer._id)} className="bg-red-500 border-2 border-black hover:border-red-800 hover:text-red-950 hover:animate-pulse text-white font-semibold rounded-lg p-2 w-fit h-fit">Delete</button>
                              <button className="rounded-lg p-2 w-fit h-fit border mx-auto text-white" onClick={onClose}>Close</button>
                      </div>
                      </div>
                      </div>
                      )}
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <img src={customer.avatar} className="size-20 border rounded-full border-white object-cover object-top" alt="IMAGES" />
                        <BsThreeDots className="text-white" onClick={() => toggleOpns(customer._id)} />
                        {seeOpns[customer._id] && (
                          <div className="flex flex-col rounded-lg bg-white absolute top-20 right-5" ref={opnsRef}>
                            <ul>
                              <li 
                                className="border-b p-2 cursor-pointer text-green-900" 
                                onClick={() => startEditing(customer)}
                              >
                                Update Info
                              </li>
                              <li className="text-red-700 p-2 cursor-pointer" onClick={() => setDeleteData(customer._id)}>Delete Info</li>
                            </ul>
                      </div>
                        )}
                      </div>
                      <div className="text-white flex justify-between">
                       <div className="flex flex-col">
                        <p className="text-sm font-bold">Name: {customer.firstName} {customer.lastName}</p>
                        <p className="text-sm font-bold">Username: {customer.username}</p>
                      </div>
                       <div>
                          <p onClick={() => handleViewOrders(customer._id, customer.username)} className="p-1 rounded white text-green-900 text-sm text-center bg-white cursor-pointer">View Order History</p>
                      </div>
                      </div>
                      </div>
                    <div className="p-2 mt-4 rounded-lg bg-green-400 font-semibold">
                      <div className="mt-4">
                        <p className="mb-2 font-semibold">Contact Info:</p>
                        <p className="flex items-center gap-3"><MdEmail />{customer.email}</p>
                        <p className="flex items-center gap-3"><BiPhone />{customer.phone}</p>
                      </div>
                      </div>
                      </div>
                ))
            ) : (
              "No Customers Found"
            )}

                      </div>
                      </div>
                      </div>
                      </div>
                      </div>
      {showOrderHistory && (
        <div className="fixed w-[70%] top-0 h-[100%] bg-black opacity-90 p-6 rounded shadow-lg text-center right-[0%] z-50" ref={opnsRef}>
          <div className="h-fit flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white font-bold">Order History - {selectedCustomer}</h2>
              <button 
                onClick={() => setShowOrderHistory(false)}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
                      </div>
            
            <div className="overflow-y-auto max-h-[80vh]">
              {selectedCustomerOrders.length > 0 ? (
                selectedCustomerOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-md text-white ${
                        order.orderStatus === "Pending" ? "bg-yellow-500" :
                        order.orderStatus === "Completed" ? "bg-green-500" :
                        order.orderStatus === "Processing" ? "bg-blue-500" :
                        "bg-gray-500"
                      }`}>
                        {order.orderStatus}
                      </span>
                      <p className="text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      </div>
                    <div className="mt-2">
                      <p className="font-semibold">Services:</p>
                      {order.serviceType.map((service, index) => (
                        <span key={index} className="mr-2">
                          {service.category}
                        </span>
                      ))}
                      </div>
                    <p className="mt-2">
                      <span className="font-semibold">Total Cost:</span> ₦{order.totalCost}
                    </p>
                      </div>
                ))
              ) : (
                <p className="text-white text-lg">Customer currently has no orders.</p>
              )}
                      </div>
                      </div>
                      </div>
      )}
    </>
  );
};
export default Customers;
