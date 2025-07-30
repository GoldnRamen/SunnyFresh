import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AllUsers from "../components/AllUsers";

import logo from "../PNG/household.png"
import bgImg from "../PNG/side-view-smiley-man-ironing-shirt.jpg"
import employee1 from "../PNG/young-african-american-man-doing-laundry.jpg"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import { MdSpaceDashboard } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { GiSoap } from "react-icons/gi";
import { FaTools } from "react-icons/fa";
import { RiFirstAidKitFill } from "react-icons/ri";

const EmployeeDash = () => {
  const user =  JSON.parse(localStorage.getItem("laundry_employee_loggedUser"));
  const employeeId = user.id
  const employeeFname = user.firstName
  const employeeLname = user.lastName
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([]);

  const toHome = ()=>{
    navigate("/")
  }


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
                <Link to="/employeeDash" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <MdSpaceDashboard className="text-gray-400"/>Dashboard
                  </p>
                </Link>
                <Link to="/employeeInbox" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <HiMiniInboxArrowDown className="text-gray-400"/>Inbox
                  </p>
                </Link>
                <Link to="/requestLeave" className="no-underline text-black">
                  <p className="p-2 text-sm border-b cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                  <AiFillSchedule className="text-gray-400"/>Schedule
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
              <p className="font-indie font-bold">Employee Dash</p>
              <div className="fixed flex items-center gap-3 right-5">
                <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                <Link to="/" className="my-auto text-center">
                  <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                </Link>
                <p className="text-xs">{employeeFname} {employeeLname}</p>
              </div>
            </div>
          </div>
          <div className="fixed h-[80%] right-0 w-[80%] p-3" style={{backgroundImage: `url(${bgImg})`, backgroundPosition: "top", backgroundRepeat:"no-repeat", backgroundSize:"contain"}}>
            
          </div>
          
        </div>
      </div>
    </>
  );
};
export default EmployeeDash;
