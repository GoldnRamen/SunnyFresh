import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

import logo from "../PNG/household.png"
import bgImg from "../PNG/iv36QNz8S5acqDfotE8kDA.jpeg"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosPeople, IoMdNotifications } from "react-icons/io";
import { GiBiceps, GiSoap } from "react-icons/gi";
import { LiaStoreAltSolid } from "react-icons/lia";
import { FaClipboardList, FaTools } from "react-icons/fa";
import { SiBlockbench } from "react-icons/si";
import { RiFirstAidKitFill } from "react-icons/ri";
import axios from "axios";
const AdminDash = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([]);
  // const username = user.user_name
  // const[profiles, setProfiles] = ([])
  // const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate()
  // const handleUsers = () => {};

  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = loggedUser.id
  const adminFname = loggedUser.firstName
  const adminLname = loggedUser.lastName
  const adminEmail = loggedUser.email

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');
    
    socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      if (notification.type === 'payment') {
        setNotifications(prev => [...prev, notification]);
      }
    };
  
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!adminId) return; // Prevent running if adminId is not available
        console.log(adminId)
  
        const resp = await axios.get(`http://localhost:5000/api/users/single/${adminId}`);
        console.log(resp.data)
        setData(resp.data); // Store data in state
        
        // If you need the token, store it in local storage or state
        const token = resp.data.token;
        if (token) {
          localStorage.setItem("adminToken", token); // Example: Store token
        }
  
      } catch (error) {
        setError(error.message);
        console.error("Error fetching admin:", error.response?.data || error.message);
        toast.error("Error Fetching Administrator, Try again!")
      }
    };
  
    fetchAdminData();
  }, [adminId]); // Include `adminId` in dependency array

  const toHome = ()=>{
    navigate("/")
  }
  return (
    <>
      <div className="mt-[8%]">
        
        <div className="mt-20">
          <div className="fixed left-0 w-[250px] top-2 p-1 border-r border shadow-lg h-fit bg-gray-200" >
            <div className="flex items-end mb-12 cursor-pointer" onClick={toHome}>
              <p className="font-indie lg:text-3xl text-black text-xl animate-pulse"><u>Sunny Fresh</u></p>
              <img src={logo} className="size-10" />
            </div>
            <div className="overflow-y-scroll scrollbar-thin scrollbar-track-transparent h-[80vh] scrollbar-thumb-gray-500 relative">
              <div className="">
                <Link to="/adminDash" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <MdSpaceDashboard className="text-gray-400"/>Dashboard
                  </p>
                </Link>
                <Link to="/inbox" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <HiMiniInboxArrowDown className="text-gray-400"/>Inbox
                  </p>
                </Link>
                <Link to="/leaveManagement" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <AiFillSchedule className="text-gray-400"/>Schedule
                  </p>
                </Link>
              </div>
              <hr className="h-1 border-gray-800"/>
              {/* <p className="p-3 text-sm font-bold text-gray-800 border-b">
                  PERSONNEL
              </p> */}
              <div className="">
                <Link to="/customers" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <IoIosPeople className="text-gray-400"/>Customers
                  </p>
                </Link>  
                <Link to="/employees" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <GiBiceps className="text-gray-400"/>Employees
                  </p>
                </Link>  
                <Link to="/suppliers" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <LiaStoreAltSolid className="text-gray-400"/>Suppliers
                  </p>
                </Link>  
              </div>
              <hr className="h-1 border-gray-800"/>
              <Link to="/inventory">
                <p className="p-2 text-sm text-black border-b font-bold cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                <MdOutlineInventory />INVENTORY
                </p>
              </Link>
              <Link to="/login" className="no-underline text-black">
                <p className="p-3 border-b cursor-pointer font-bold hover:shadow-black hover:shadow">
                    Logout
                </p>
              </Link>
              
            </div>
            
          </div>
          <div className="flex fixed flex-col w-full h-[10vh] bg-white z-50 top-0 left-[20%] mx-auto border-b shadow p-3">
            <div className="relative h-fit w-fit flex items-center m-2">
              <p className="font-indie font-bold">Administrator Dash</p>
                <div className="fixed flex items-center gap-3 right-5">
                <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                <Link to="/adminDash" className="my-auto text-center">
                  <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                </Link>
                <p className="text-xs">{adminFname}&nbsp;{adminLname}</p>
              </div>
            </div>
          </div>
          <div className="fixed h-[80%] right-0 w-[80%]  p-3" style={{backgroundImage: `url(${bgImg})`, backgroundPosition: "center", backgroundRepeat:"no-repeat", backgroundSize:"cover"}}>
            <div className="relative h-full border p-4 flex bg-opacity-50 bg-gray-700">
              
            </div>
          </div>
          
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};
export default AdminDash;
