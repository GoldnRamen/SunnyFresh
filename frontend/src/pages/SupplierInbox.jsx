import React, { useState, useEffect, useRef } from "react";
import tumblrPhoto from "../PNG/Tumblr_Logos_2018.03.06_Wordmark Black.png"
import { Link, useNavigate } from "react-router-dom";
import AllUsers from "../components/AllUsers";

import logo from "../PNG/household.png"
import bgImg from "../PNG/iv36QNz8S5acqDfotE8kDA.jpeg"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import { MdSpaceDashboard } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosPeople, IoMdNotifications } from "react-icons/io";
import { GiBiceps, GiSoap } from "react-icons/gi";
import { LiaStoreAltSolid } from "react-icons/lia";
import { FaClipboardList, FaTools } from "react-icons/fa";
import { SiBlockbench } from "react-icons/si";
import { RiFirstAidKitFill } from "react-icons/ri";
import axios from "axios";
import AllOrders from "../components/AllOrders";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingOrders from "../components/PendingOrders";
import AdminOrders from "../components/AdminOrders";

const SupplierInbox = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  // const username = user.user_name
  const [profiles, setProfiles] = useState([])
  const [showUsers, setShowUsers] = useState(false);
  const [seeOpns, setOpns] = useState(false);
  const navigate = useNavigate()
  const [orders, setOrders] = useState(false)
  const opnsRef = useRef(null);

  const user =  JSON.parse(localStorage.getItem("laundry_supplier_loggedUser"));
  const supplierId = user.id
  const supplierFname = user.firstName
  const supplierLname = user.lastName
  
  
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
  // useEffect(() => {
  //   const fetchAdminData = async () => {
  //     try {
  //       if (!supplierId) return;
  //       console.log(supplierId)
  
  //       const resp = await axios.get(`http://localhost:5000/api/post-notifier/${supplierId}`);
  //       console.log(resp.data)
  //       setData(resp.data);
  
  //     } catch (error) {
  //       setError(error.message);
  //       console.error("Error fetching admin:", error.response?.data || error.message);
  //       toast.warn("Trouble loading details");
  //     }
  //   };
  
  //   fetchAdminData();
  // }, [supplierId]);

  const toggleOrders =()=>{
    setOrders(prevState => !prevState)
    // setOpns(prevState => !prevState)
  }

  const toHome = ()=>{
    navigate("/supplierDash")
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
                <Link to="/supplierDash" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <MdSpaceDashboard className="text-gray-400"/>Dashboard
                  </p>
                </Link>
                <Link to="/supplierInbox" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <HiMiniInboxArrowDown className="text-gray-400"/>Inbox
                  </p>
                </Link>
              </div>
              <Link to="/login" className="no-underline text-black">
                <p className="p-3 border-b cursor-pointer text-red-950 font-bold">
                    Logout
                </p>
              </Link>
              
            </div>
            
          </div>
          <div className="flex fixed flex-col w-full h-[10vh] bg-white z-50 top-0 left-[20%] mx-auto border-b shadow p-3">
            <div className="relative h-fit w-fit flex items-center m-2">
              <p className="font-indie font-bold">Inbox</p>
                <div className="fixed flex items-center gap-3 right-5">
                <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                <Link to="/supplierDash" className="my-auto text-center">
                  <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                </Link>
                <p className="text-xs">{supplierFname}&nbsp;{supplierLname}</p>
              </div>
            </div>
          </div>
          <div className="fixed h-[80%] right-0 w-[80%] p-3 flex border">
            <div className="relative h-full border p-4 flex bg-opacity-50 gap-4 flex-col bg-gray-200">
                <div className="rounded shadow-black shadow p-3 text-center h-fit w-fit cursor-pointer" onClick={toggleOrders}>Orders</div>
                {/* <div className="rounded shadow-black shadow p-3 text-center h-fit w-fit" onClick={togglesupplierInbox}>supplier Inbox</div>
                <div className="rounded shadow-black shadow p-3 text-center h-fit w-fit" onClick={toggleSupplierInbox}>Supplier Inbox</div> */}
            </div>
            <div>
                {orders && (<AdminOrders />)}
                {/* {orders && (<AllOrders />)}
                {orders && (<AllOrders />)} */}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default SupplierInbox;
