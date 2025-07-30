import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../PNG/household.png"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
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

const Suppliers = () => {
  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = loggedUser.id
  const adminFname = loggedUser.firstName
  const adminLname = loggedUser.lastName
  const [supplierData, setSupplierData] = useState([]);
  const [seeOpns, setSeeOpns] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState({});
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [orderSupplierId, setOrderSupplierId] = useState(null);
  const [supplierForm, setSupplierForm] = useState(false);
  const [updateData, setUpdateData] = useState(false)
  const [deleteData, setDeleteData] = useState(null)

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

  const [newItem, setNewItem] = useState({
    adminId: JSON.parse(localStorage.getItem("laundry_admin")).id,
    itemName: "",
    itemQuantity: "",
    itemCategory: "utilitiesItems",
    orderStatus: "",
    content: ""
  });
  const navigate = useNavigate()
  const opnsRef = useRef(null);
  
  const toHome = ()=>{
    navigate("/")
  }
  
  const toggleSupplierForm = ()=>{
    setSupplierForm(true)
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
    const handleAllSuppliers = async () => {
      try {
        if (!adminId) return; // Ensure adminId exists before making the request
  
        console.log("Admin ID:", adminId);
  
        const resp = await axios.get("http://localhost:5000/api/users/supplier/all");
        console.log(resp.data);
  
        setSupplierData(resp.data.data.filter(user => user.role === "supplier"))
  
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
  
    handleAllSuppliers();
  }, [adminId]); // Runs whenever adminId changes

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
    setDeleteData(false);
    setSupplierForm(false);
    setEditingSupplierId(false);
    setOrderSupplierId(null);
    setSeeOpns(false);
    setNewItem({
      itemName: "",
      itemQuantity: "",
      itemCategory: "otherItems",
      content: "",
    });
  };

  const toggleOpns = (customerId) => {
    setSeeOpns((prev) => ({
      ...prev,
      [customerId]: !prev[customerId], // Toggle specific customer's options
    }));
  };

const handleChange = (e) => {
const { value, name } = e.target;
setInputValues((prevState) => ({
...prevState,
[name]: value,
}));
};
const handleOrderChange = (e) => {
const { value, name } = e.target;
setNewItem((prevState) => ({
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
      "Password must be 4-8 characters, include at least one uppercase letter, one lowercase letter, and one number";
  }
  if (Object.keys(newErrors).length > 0) {
    setError(newErrors);
    return;
  }
  
    try {
      const resp = await axios.post(
        `http://localhost:5000/api/users/register/supplier`,
        inputValues
      );

      if (resp.data.success) {
        toast.success("Supplier created successfully!");
        setSupplierData((prevState) => !prevState);
        setSupplierForm((prevState) => !prevState);
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

const handleUpdate = async (e, supplierId) => {
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
  
  // Only validate password if it's not empty
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,8}$/;
  if (inputValues.password && inputValues.password.trim() !== "") {
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
  if (!dataToUpdate.password || dataToUpdate.password.trim() === "") {
    delete dataToUpdate.password;
  }

  try {
    const resp = await axios.put(
      `http://localhost:5000/api/users/supplier/edit/${supplierId}`,
      dataToUpdate
    );

    if (resp.data.success) {
      toast.success("Supplier details updated successfully!");
      setSupplierData((prevState) =>
        prevState.map((supplier) =>
          supplier._id === supplierId ? { ...supplier, ...dataToUpdate } : supplier
        )
      );
      setEditingSupplierId(false)
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
}

const handleOrder = async (e, supplierId) => {
  e.preventDefault();

  const newErrors = {};
  if (!newItem.itemName || newItem.itemName.trim().length < 2) {
    newErrors.itemName = "Item Name must be at least 2 characters long";
  }
  if (!newItem.itemQuantity || newItem.itemQuantity < 10) {
    newErrors.itemQuantity = "Must order 10 or more units";
  }

  if (Object.keys(newErrors).length > 0) {
    setError(newErrors);
    return;
  }

  let adminData = localStorage.getItem("laundry_admin");
  if (!adminData) {
    toast.error("Admin not found in local storage.");
    return;
  }

  const adminId = JSON.parse(adminData).id;
  const orderData = {
    adminId, // Ensure adminId exists
    supplierId, 
    itemName: newItem.itemName,
    itemQuantity: Number(newItem.itemQuantity), // Ensure it's a number
    itemCategory: newItem.itemCategory || "otherItems", // Ensure it's set
    content: newItem.content,
    orderStatus: "pending"
  };
  try {
    const resp = await axios.post(
      "http://localhost:5000/api/post-notifier",
      orderData
    );

    console.log(resp.data);
    console.log(newItem);

    if (resp.data.success) {
      toast.success("Order sent successfully!");
      setNewItem({
        itemName: "",
        itemQuantity: "",
        itemCategory: "otherItems",
        content: "",
      });

      setOrderSupplierId(false);
    } else {
      toast.error("Something went wrong while placing Order");
      alert("Something went wrong");
    }
  } catch (error) {
    console.error("Error:", error);
    if (error.response) {
      if (error.response.status === 403) {
        toast.warn("You do not have permission to access this resource.");
      } else if (error.response.status === 400) {
        toast.warn("Error submitting form");
      }
    } else {
      toast.error("An error occurred. Please try again.");
    }
    setNewItem({
      itemName: "",
      itemQuantity: "",
      itemCategory: "otherItems",
      content: "",
    });
  }
};

  const handleDelete = async(supplierId) =>{
    try {
      if (!supplierId) {
        toast.error("Invalid Supplier ID");
        return;
      }
      const response = await axios.delete( `http://localhost:5000/api/users/supplier/remove/${supplierId}`)
      if(response.data.success){
        toast.success("Supplier Deleted Successfully", {autoClose:2000})
        setDeleteData(false)
        setSeeOpns(false)
      }
      else{
        toast.error("Failed to delete Supplier", {autoClose:2000})
      }
    } catch (error) {
      console.error("Error:", error.message);
          toast.error("An error occurred. Please try again.", {autoClose:2000});
    }
  }

  return (
    <>
    <div className="bg-blue-200 w-full h-full z-50">
      
        
      <div className="mt-[8%]">
        
        <div className="mt-20">
        <div className="fixed left-0 w-[250px] top-2 p-1 border-r border rounded shadow-slate-700 shadow-lg h-fit bg-blue-800" >
            <div className="flex items-end mb-12 cursor-pointer" onClick={toHome}>
              <p className="font-indie lg:text-3xl text-white text-xl animate-pulse"><u>Sunny Fresh</u></p>
              <img src={logo} alt="logo-image" className="size-10" />
            </div>
            <div className="overflow-y-scroll scrollbar-thin scrollbar-track-transparent h-[80vh] scrollbar-thumb-blue-950 relative">
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
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <IoIosPeople className="text-white"/>Customers
                  </p>
                </Link> 
                <Link to="/employees" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-orange-300 cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <GiBiceps className="text-white"/>Employees
                  </p>
                </Link>   
                <Link to="/suppliers" className="no-underline text-white">
                  <p className="p-2 text-sm border-b-2 border-b-black cursor-pointer text-blue-800 hover:shadow-black hover:shadow flex gap-1 items-center bg-white">
                  <LiaStoreAltSolid className="text-blue-800"/>Suppliers
                  </p>
                </Link> 
              </div>
              <hr className="h-1 border-gray-800"/>
              <Link to="/inventory">
                <p className="p-2 text-sm text-white font-bold cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                <MdOutlineInventory />INVENTORY
                </p>
              </Link>
              <Link to="/login" className="no-underline text-black">
                <p className="p-3 cursor-pointer text-white font-bold hover:shadow-black hover:shadow">
                    Logout
                </p>
              </Link>
            </div>
            
          </div>
          <div className="flex fixed flex-col w-full h-[10vh] bg-white z-50 top-0 left-[20%] mx-auto border shadow-slate-700 shadow-lg p-3">
            <div className="relative h-fit w-fit flex items-center m-2">
              <p className="font-indie font-bold">Suppliers</p>
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
            <div className="flex justify-between p-1 relative">
              {supplierForm && (
                <div className="w-[80%] h-[85%] bg-black opacity-95 z-50 fixed top-20 right-5">
                <p className="text-center mt-2 text-white">Supplier Registeration Form</p>
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
              {supplierData.length && (
                <p className="text-2xl font-semibold flex gap-1"><p className="text-green-950">{supplierData.length}</p> Supplier(s)</p>
              )}
              <div className="flex-col flex gap-1">
                <div className="p-2 text-center w-full items-center flex cursor-pointer h-fit rounded-lg bg-blue-800 text-white relative group">
                  <FaPlus className="text-white size-3" onClick={toggleSupplierForm}/>
                  <div className="absolute -bottom-[40%] right-7 transform -translate-y-1/2 translate-x-[-8px] px-1 py-1 bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity w-fit">
                      Add&nbsp;Supplier
                  </div>
                </div>
                <div className="p-2 text-center w-full items-center flex cursor-pointer h-fit rounded-lg bg-blue-800 text-white relative group">
                  <MdOutlineCategory className="text-white size-3" />
                  <div className="absolute -bottom-[40%] right-7 transform -translate-y-1/2 translate-x-[-8px] px-1 py-1 bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Place&nbsp;Order
                  </div>
                </div>
              </div>
            </div>
            <div className="gap-2 grid grid-cols-3 p-3"> {/* gap here is used till the api supplies the data */}
              {supplierData && supplierData.length > 0 ? (
                [...supplierData]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by latest first
                .map((supplier) => (
                  <div className="bg-blue-800 flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" key={supplier._id}>
                     {editingSupplierId === supplier._id && (
                       <div className="w-[80%] h-[85%] bg-black opacity-95 z-50 fixed top-20 right-5">
                         <div className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
                           <h2 className="text-xl font-semibold">Update Supplier Information</h2>
                           <button 
                             onClick={onClose}
                             className="text-white hover:text-gray-200 text-xl"
                           >
                             ✕
                           </button>
                         </div>
                         
                         <form onSubmit={(e) => handleUpdate(e, supplier._id)} className="h-[90%] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-600 p-6">
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
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                                   placeholder="First Name" 
                                 />
                                 {error.firstName && <p className="text-red-500 text-xs mt-1">{error.firstName}</p>}
                               </div>
                               
                               <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                 <label className="block text-white text-sm font-semibold mb-2">Last Name</label>
                                 <input 
                                   type="text" 
                                   name="lastName" 
                                   value={inputValues.lastName} 
                                   onChange={handleChange}
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                                   placeholder="Last Name" 
                                 />
                                 {error.lastName && <p className="text-red-500 text-xs mt-1">{error.lastName}</p>}
                               </div>
                               
                               <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                 <label className="block text-white text-sm font-semibold mb-2">Username</label>
                                 <input 
                                   type="text" 
                                   name="username" 
                                   value={inputValues.username} 
                                   onChange={handleChange}
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
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
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
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
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                                   placeholder="Phone Number" 
                                 />
                                 {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
                               </div>
                               
                               <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
                                 <label className="block text-white text-sm font-semibold mb-2">Gender</label>
                                 <select 
                                   name="gender" 
                                   value={inputValues.gender} 
                                   onChange={handleChange}
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
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
                                 <label className="block text-white text-sm font-semibold mb-2">
                                   Password <span className="text-gray-400 text-xs">(Optional - leave blank to keep current)</span>
                                 </label>
                                 <input 
                                   type="password" 
                                   name="password" 
                                   value={inputValues.password} 
                                   onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })}
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
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
                                   className="rounded-lg p-2 w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                                   placeholder="Avatar URL" 
                                 />
                                 {error.avatar && <p className="text-red-500 text-xs mt-1">{error.avatar}</p>}
                                 
                                 {/* Avatar Preview */}
                                 {inputValues.avatar && (
                                   <div className="mt-4 flex items-center justify-center">
                                     <img 
                                       src={inputValues.avatar} 
                                       alt="Avatar Preview" 
                                       className="h-24 w-24 object-cover rounded-full border-2 border-blue-300"
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
                               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                             >
                               Update Supplier
                             </button>
                             
                             <button 
                               type="button"
                               onClick={onClose}
                               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                             >
                               Cancel
                             </button>
                           </div>
                         </form>
                       </div>
                        )}
                        {orderSupplierId === supplier._id && (
                         <div className="w-[80%] h-[85%] bg-black opacity-95 z-50 fixed top-20 right-5">
                           <p className="text-center mt-2 text-white">Supplier Request Form</p>
                           <form action="" onSubmit={(e) => handleOrder(e, supplier._id)} className=" h-[90%] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-yellow-600">
                             <div className="w-full h-fit flex flex-col mx-auto mt-8 space-y-2">
                                 <div className="flex flex-col items-center">
                                   <input type="text" onChange={handleOrderChange} name="itemName" value={newItem.itemName} className="bg-white w-[30%] p-2 h-[60%] mx-auto rounded-lg" placeholder="Item Name" />
                                   {error.itemName && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.itemName}</p>}
                                 </div>
                                 <div className="flex flex-col items-center">
                                   <input type="number" onChange={handleOrderChange} name="itemQuantity" value={newItem.itemQuantity} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Item Quantity"/>
                                   {error.itemQuantity && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.itemQuantity}</p>}
                                 </div>
                                 
                                 <div className="flex flex-col items-center">
                                    <select
                                        className="bg-white w-[30%] p-2 h-[60%] mx-auto rounded-lg"
                                        value={newItem.itemCategory}
                                        name="itemCategory"
                                        onChange={(e) =>
                                            setNewItem({ ...newItem, itemCategory: e.target.value })
                                        }                                >
                                        <option value="otherItems">Select Category</option>
                                        <option value="cleaningItems">Cleaning Items</option>
                                        <option value="packagingItems">Packaging Items</option>
                                        <option value="equipmentItems">All Equipment</option>
                                        <option value="utilitiesItems">Utilities</option>
                                        <option value="safetyItems">Safety Items</option>
                                    </select>
                                 </div>
                                 <div className="flex flex-col items-center">
                                    <textarea onChange={handleOrderChange} name="content" value={newItem.content} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Details, e.g expected delivery time"/>
                                    {error.content && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.content}</p>}
                                 </div>
                             </div>
                             
                             <div className="mx-auto mt-5 w-[30%] flex gap-5">
                                 <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-center rounded w-full">Submit</button>
                                 <p onClick={onClose} className="text-white text-center hover:bg-red-600 flex p-3 border w-fit rounded cursor-pointer">Close</p>
                             </div>
                           </form>
                         </div>
                          )}
                          {deleteData === supplier._id && (
                            <div className="w-[80%] h-[100%] bg-black opacity-90 z-50 fixed right-0 top-20" ref={opnsRef}>
                              <div className="mt-[15vh] flex flex-col relative">
                                <p className="text-white text-center">Are you sure you want to delete this supplier's data? Action is <strong className="text-red-700">irreversible!!</strong></p>
                                <div className="flex gap-5 mx-auto mt-10 items-center">
                                  <button onClick={()=>handleDelete(supplier._id)} className="bg-red-500 border-2 border-black hover:border-red-800 hover:text-red-950 hover:animate-pulse text-white font-semibold rounded-lg p-2 w-fit h-fit">Delete</button>
                                  <button className="rounded-lg p-2 w-fit h-fit border mx-auto text-white" onClick={onClose}>Close</button>
                                </div>
                              </div>
                            </div>
                          )}
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <img src={supplier.avatar} className="size-20 border rounded-full border-white object-cover object-top" alt="IMAGES" />
                          <BsThreeDots className="text-white" onClick={()=> toggleOpns(supplier._id)}/>
                          {seeOpns[supplier._id] && (
                            <div className="flex flex-col rounded-lg bg-white absolute top-20 right-5" ref={opnsRef}>
                              <ul>
                                <li className="border-b p-2 cursor-pointer text-blue-900" onClick={() => {
                                  setEditingSupplierId(supplier._id);
                                  setInputValues({
                                    firstName: supplier.firstName || "",
                                    lastName: supplier.lastName || "",
                                    username: supplier.username || "",
                                    email: supplier.email || "",
                                    phone: supplier.phone || "",
                                    avatar: supplier.avatar || "",
                                    gender: supplier.gender || "",
                                    password: ""
                                  });
                                  setError({});
                                }}>Update Info</li>
                                <li className="border-b p-2 cursor-pointer text-blue-900" onClick={() => setOrderSupplierId(supplier._id)}>Place an Order</li>
                                <li className="text-red-700 p-2 cursor-pointer" onClick={()=>setDeleteData(supplier._id)}>Delete Info</li>
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-white">
                          <p className="text-sm font-bold">Name: {supplier.firstName} {supplier.lastName}</p>
                          <p className="text-sm">Username: {supplier.username}</p>
                          <p className="text-sm">Wash Supervisor</p>
                        </div>
                      </div>
                      <div className="p-2 mt-4 rounded-lg bg-blue-400 font-semibold">
                        <div className="flex justify-between items-center text-gray-600">
                          <p className="text-sm">Department</p>
                          <p className="text-sm">Hired Date</p>
                        </div>
                        <div className="flex justify-between items-center font-semibold">
                          <p className="text-sm">Wash</p>
                          <p className="text-sm">{supplier.createdAt.split("T")[0]}</p>
                        </div>
                        <div className="mt-4">
                          <p className="mb-2 font-semibold">Contact Info:</p>
                          <p className="flex items-center gap-3"><MdEmail />{supplier.email}</p>
                          <p className="flex items-center gap-3"><BiPhone />{supplier.phone}</p>
                        </div>
                      </div>
                      </div>  
                  ))
                  ) : (
                  "No Supplier Found"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      
      <ToastContainer />
    
    </>
  );
};

export default Suppliers;
