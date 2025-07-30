import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import logo from "../PNG/household.png"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import { MdSpaceDashboard } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosPeople, IoMdNotifications } from "react-icons/io";
import { GiBiceps, GiSoap } from "react-icons/gi";
import { LiaStoreAltSolid } from "react-icons/lia";
import { MdOutlineInventory } from "react-icons/md";

const Leavemanagement = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const navigate = useNavigate()
    const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
    const adminId = loggedUser.id
    const adminFname = loggedUser.firstName
    const adminLname = loggedUser.lastName
    
    const toHome = ()=>{
        navigate("/")
    } 

    useEffect(() => {
        fetchLeaveRequests(); // Fetch leave requests on component mount
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/leave/all"); // Adjust the endpoint as necessary
            // Check if the response data is an array
            if (Array.isArray(response.data.data)) {
                setLeaveRequests(response.data.data); // Set leave requests if it's an array
            } else {
                console.error("Unexpected response format:", response.data);
                setLeaveRequests([]); // Reset to an empty array if the format is unexpected
            }
        } catch (error) {
            console.error("Error fetching leave requests:", error);
            setLeaveRequests([]); // Reset to an empty array on error
        }
    };

    const updateLeaveStatus = async (leaveId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/leave/${leaveId}`, { leaveStatus: status });
            alert("Leave status updated successfully!");
            fetchLeaveRequests(); // Refresh the leave requests after updating status
        } catch (error) {
            console.error("Error updating leave status:", error);
            alert("Failed to update leave status: " + error.response.data.message);
        }
    };
  
    useEffect(() => {
      fetchLeaveRequests();
    }, []);
  
    return (
        <>
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
                        <p className="p-2 text-sm border-b font-bold cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
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
                <p className="font-indie font-bold">Leave Schedule</p>
                <div className="fixed flex items-center gap-3 right-5">
                    <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                    <Link to="/adminDash" className="my-auto text-center">
                        <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                    </Link>
                    <p className="text-xs">{adminFname}&nbsp;{adminLname}</p>
                </div>
            </div>
            </div>

            <div className="container fixed h-[80%] w-[80%] right-0 mx-auto mt-20 p-6 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Manage Leave Requests</h2>
                    {leaveRequests.length === 0 ? (
                        <p>No leave requests available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {leaveRequests.map((request) => (
                                <li key={request._id} className="p-4 border border-gray-300 rounded-md">
                                    <p><strong>Employee ID:</strong> {request.employeeId._id}</p>
                                    <p><strong>Employee Name:</strong> {request.employeeId.firstName} {request.employeeId.lastName}</p>
                                    <p><strong>Leave Type:</strong> {request.leaveType}</p>
                                    <p><strong>Start Date:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
                                    <p><strong>Status:</strong> {request.leaveStatus}</p>
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => updateLeaveStatus(request._id, "approved")}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateLeaveStatus(request._id, "rejected")}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Leavemanagement;
  