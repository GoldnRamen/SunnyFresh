import React, { useState, useEffect, useRef } from "react";
// import tumblrPhoto from "../PNG/Tumblr_Logos_2018.03.06_Wordmark Black.png"
import { Link, useNavigate } from "react-router-dom";
// import AllUsers from "../components/AllUsers";

import logo from "../PNG/household.png"
// import bgImg from "../PNG/iv36QNz8S5acqDfotE8kDA.jpeg"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import { MdSpaceDashboard } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosPeople, IoMdNotifications } from "react-icons/io";
import { GiBiceps, GiSoap } from "react-icons/gi";
import { LiaStoreAltSolid } from "react-icons/lia";
import { FaClipboardList, FaTools } from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import { SiBlockbench } from "react-icons/si";
import { RiFirstAidKitFill } from "react-icons/ri";
import axios from "axios";
import AllOrders from "../components/AllOrders";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoneOrders from "../components/DoneOrders";
import PendingOrders from "../components/PendingOrders";
import ProcessingOrders from "../components/ProcessingOrders";
import NotificationBell from '../components/NotificationBell';
import AdminPending from "../components/AdminPending";
import SupplierOrders from "../components/SupplierOrders";

const Inbox = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  // const username = user.user_name
  // const[profiles, setProfiles] = ([])
  // const [showUsers, setShowUsers] = useState(false);
  const [seeOpns, setOpns] = useState(false);
  const [seeOpns2, setOpns2] = useState({});
  const navigate = useNavigate()
  const [orders, setOrders] = useState(false)
  const [supplierOrders, setSupplierOrders] = useState(false)
  const [completedOrders, setCompletedOrders] = useState(false)
  const [processingOrders, setProcessingOrders] = useState(false)
  const [pendingOrders, setPendingOrders] = useState(false)
  const opnsRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = loggedUser.id
  const adminFname = loggedUser.firstName
  const adminLname = loggedUser.lastName
  // const adminEmail = loggedUser.email
  
  
  useEffect(()=>{
    const handleOutClick = (event) => {
      if (opnsRef.current && !opnsRef.current.contains(event.target)){
        setOpns({})
      }
    };
    document.addEventListener("mousedown", handleOutClick)
    return()=>{
      document.removeEventListener("mousedown", handleOutClick)
    }
  },[])
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
        toast.warn("Trouble loading details");
      }
    };
  
    fetchAdminData();
  }, [adminId]); // Include `adminId` in dependency array

  const toggleOrders = () => {
    setOrders(prev => {
      const newState = !prev;
      if (newState) {
        setSupplierOrders(false); // Ensure Supplier Orders are hidden
      }
      return newState;
    });
    if (!orders) {
      setCompletedOrders(false);
      setProcessingOrders(false);
      setPendingOrders(false);
    }
  }

  const toggleSupplierOrders = () => {
    setSupplierOrders(prev => {
      const newState = !prev;
      if (newState) {
        setOrders(false); // Ensure Customer Orders are hidden
      }
      return newState;
    });
    if (!supplierOrders) {
      setCompletedOrders(false);
      setProcessingOrders(false);
      setPendingOrders(false);
    }
  }

  const toggleCompleted = ()=>{
    setCompletedOrders(true)
    setProcessingOrders(false)
    setPendingOrders(false)
    setOrders(false)
    setSupplierOrders(false)
  }

  const toggleProcessing = ()=>{
    setOrders(false)
    setSupplierOrders(false)
    setCompletedOrders(false)
    setProcessingOrders(true)
    setPendingOrders(false)
  }
  const togglePending = ()=>{
    setOrders(false)
    setSupplierOrders(false)
    setCompletedOrders(false)
    setProcessingOrders(false)
    setPendingOrders(true)
  }

  const toHome = ()=>{
    navigate("/")
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <div className="mt-[8%]">
        
        <div className="mt-20">
          <div className="fixed left-0 w-[250px] top-2 p-1 border-r border shadow-lg h-fit bg-gray-200" >
            <div className="flex items-end mb-12 cursor-pointer" onClick={toHome}>
              <p className="font-indie lg:text-3xl text-black text-xl animate-pulse"><u>Sunny Fresh</u></p>
              <img src={logo} alt="logo" className="size-10" />
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
                <p className="p-2 text-sm text-black font-bold cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                <MdOutlineInventory />INVENTORY
                </p>
              </Link>
              <Link to="/login" className="no-underline text-black">
                <p className="p-3 cursor-pointer font-bold hover:shadow-black hover:shadow">
                    Logout
                </p>
              </Link>
              
            </div>
            
          </div>
          <div className="flex fixed flex-col w-full h-[10vh] bg-white z-50 top-0 left-[20%] mx-auto border-b shadow p-3">
            <div className="relative h-fit w-fit flex items-center m-2">
              <p className="font-indie font-bold">Inbox</p>
                <div className="fixed flex items-center gap-3 right-5">
                <NotificationBell />
                <Link to="/admindash" className="my-auto text-center">
                  <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                </Link>
                <p className="text-xs">{adminFname}&nbsp;{adminLname}</p>
              </div>
            </div>
          </div>
          {/* <div className="fixed h-[80%] right-0 w-[80%] p-3 flex border">
            <div className="relative h-full border p-4 flex bg-opacity-50 gap-4 flex-col bg-gray-200">
                <div className="rounded shadow-black shadow p-3 text-center h-fit w-fit cursor-pointer" onClick={toggleOrders}>Customer Orders</div>
                <div className="rounded shadow-black shadow p-3 text-center h-fit w-fit cursor-pointer" onClick={toggleOrders}>Supplier Orders</div>
                {seeOpns && (
                        <div className="flex flex-col rounded-lg bg-white absolute top-20 right-0" ref={opnsRef}>
                          <ul>
                            <li className={`border-b p-2 cursor-pointer text-blue-900 text-sm ${completedOrders ? "bg-gray-700 text-white" : ""}`} onClick={toggleCompleted}>Done Orders</li>
                            <li className={`border-b p-2 cursor-pointer text-blue-900 text-sm ${processingOrders ? "bg-gray-700 text-white" : ""}`}  onClick={toggleProcessing}>Processing Orders</li>
                            <li className={`border-b p-2 cursor-pointer text-blue-900 text-sm ${pendingOrders ? "bg-gray-700 text-white" : ""}`}  onClick={togglePending}>Pending Orders</li>
                          </ul>
                        </div>
                )}
                {/* <div className="rounded shadow-black shadow p-3 text-center h-fit w-fit" onClick={toggleEmployeeInbox}>Employee Inbox</div>
                <div className="rounded shadow-black shadow p-3 text-center h-fit w-fit" onClick={toggleSupplierInbox}>Supplier Inbox</div>
            </div>
            <div>
                {orders && (<AllOrders />)}
                {completedOrders && (<DoneOrders />)}
                {processingOrders && (<ProcessingOrders />)}
                {pendingOrders && (<AdminPending />)}
            </div>
            <div>
                {supplierOrders && (<SupplierOrders />)}
                {completedOrders && (<DoneOrders />)}
                {processingOrders && (<ProcessingOrders />)}
                {pendingOrders && (<AdminPending />)}
            </div>
          </div> */}

<div className="fixed h-[80%] right-0 w-[80%] p-3 flex border bg-gray-50">
  {/* Sidebar Navigation - Redesigned */}
  <div className="relative w-[250px] h-full border-r border-gray-200 p-4 bg-white shadow-sm">
    <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Management</h2>
    
    {/* Main Order Type Buttons */}
    <div className="space-y-3">
      <button 
        onClick={toggleOrders}
        className={`w-full px-4 py-3 flex items-center justify-between rounded-lg transition-all duration-200 ${
          orders 
            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <FaClipboardList className="text-lg" />
          <span className="font-medium">Customer Orders</span>
        </div>
      </button>

      <button 
        onClick={toggleSupplierOrders}
        className={`w-full px-4 py-3 flex items-center justify-between rounded-lg transition-all duration-200 ${
          supplierOrders 
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <LiaStoreAltSolid className="text-lg" />
          <span className="font-medium">Supplier Orders</span>
        </div>
      </button>
    </div>

    {/* Filter Section */}
    {(orders || supplierOrders) && (
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Filter by Status</h3>
        <div className="space-y-2">
          <button
            onClick={toggleCompleted}
            className={`w-full px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center justify-between ${
              completedOrders
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Done/Completed Orders
            </div>
          </button>

          <button
            onClick={toggleProcessing}
            className={`w-full px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center justify-between ${
              processingOrders
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              Processing Orders
            </div>
          </button>

          <button
            onClick={togglePending}
            className={`w-full px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center justify-between ${
              pendingOrders
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Pending Orders
            </div>
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Order Display Section - Redesigned */}
  <div className="flex-grow overflow-hidden">
    <div className="h-full overflow-y-auto">
      {orders && <AllOrders />}
      {supplierOrders && <SupplierOrders />}
      {completedOrders && <DoneOrders />}
      {processingOrders && <ProcessingOrders />}
      {pendingOrders && <AdminPending />}
    </div>
  </div>
</div>

        </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default Inbox;
