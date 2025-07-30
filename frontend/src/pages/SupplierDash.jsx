// import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const SupplierDash = () => {
 const loggedUser = JSON.parse(localStorage.getItem("laundry_supplier_loggedUser"))
 const supplierID = loggedUser.id
 const supplierFname = loggedUser.firstName
 const supplierLname = loggedUser.lastName

  const navigate = useNavigate()

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
              <img src={logo} alt="logo-image" className="size-10" />
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
              <p className="font-indie font-bold">Supplier Dash</p>
              <div className="fixed flex items-center gap-3 right-5">
                <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                <Link to="/" className="my-auto text-center">
                  <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                </Link>
                <p className="text-xs">{supplierFname}&nbsp;{supplierLname}</p>
              </div>
            </div>
          </div>
          <div className="fixed h-[80%] right-0 w-[80%] p-3" style={{backgroundImage: `url("https://cdn.pixabay.com/photo/2022/04/22/06/48/truckers-7149052_1280.jpg")`, backgroundPosition: "center", backgroundRepeat:"no-repeat", backgroundSize:"cover"}}>
            <div className="relative h-full border p-4 flex bg-opacity-50 bg-gray-700">
              
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};
export default SupplierDash;
