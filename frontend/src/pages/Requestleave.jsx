import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import logo from "../PNG/household.png"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import { MdSpaceDashboard } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";

const Requestleave = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveStatus: "pending",
    leaveType: "working",
    startDate: "",
    endDate: "",
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [stayDetails, setStayDetails] = useState("");
  const navigate = useNavigate()
  const loggedUser = JSON.parse(localStorage.getItem("laundry_employee_loggedUser"))
    const employeeId = loggedUser.id
    const employeeFname = loggedUser.firstName
    const employeeLname = loggedUser.lastName

  const toHome = ()=>{
    navigate("/")
  }
  useEffect(() => {
    const storedEmployeeId = employeeId;

    if (storedEmployeeId) {
      setFormData((prevData) => ({ ...prevData, employeeId: storedEmployeeId }));
      fetchEmployeeLeaveRequests(storedEmployeeId);
    } else {
      fetchEmployeeId();
    }
  }, []);

  const fetchEmployeeId = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee/id");
      const employeeId = response.data.id;
      localStorage.setItem("employeeId", employeeId);
      setFormData((prevData) => ({ ...prevData, employeeId }));
      fetchEmployeeLeaveRequests(employeeId);
    } catch (error) {
      console.error("Error fetching employee ID:", error);
    }
  };

  const fetchEmployeeLeaveRequests = async (employeeId) => {
    console.log("Fetching leave requests for employee ID:", employeeId);
    try {
      const response = await axios.get(`http://localhost:5000/api/leave/${employeeId}`);
      setLeaveRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching employee leave requests:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data before validation:", formData);

    // Ensure all fields are filled
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !employeeId) {
      alert("Error: All required fields must be provided.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/leave/create", formData);
      alert("Leave request submitted successfully!");

      setFormData({
        employeeId: employeeId, // Keep the employeeId
        leaveStatus: "pending",
        leaveType: "working",
        startDate: "",
        endDate: "",
      });
      fetchEmployeeLeaveRequests(employeeId);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const updateLeaveStatus = async (leaveId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/${leaveId}`, { leaveStatus: status });
      alert("Leave status updated successfully!");
      fetchEmployeeLeaveRequests(employeeId);
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update leave status: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleApproval = (requestId) => {
    alert("Please provide details of your stay before leaving.");
    setStayDetails("");
  };

  return (
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
                <p className="font-indie font-bold">Leave Schedule</p>
                    <div className="fixed flex items-center gap-3 right-5">
                    <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                    <Link to="/" className="my-auto text-center">
                    <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                    </Link>
                    <p className="text-xs">{employeeFname}&nbsp;{employeeLname}</p>
                </div>
                </div>
            </div>
          <div className="container fixed h-[80%] w-[80%] right-0 mx-auto p-6 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Request Leave</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium">
                Leave Type:
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Type</option>
                  <option value="working">Working</option>
                  <option value="casual">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="vacation">Vacation</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </label>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                End Date:
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Your Leave Requests</h2>
          {leaveRequests.length === 0 ? (
            <p>No leave requests available.</p>
          ) : (
            <ul className="space-y-4">
              {leaveRequests.map((request) => (
                <li key={request._id} className="p-4 border border-gray-300 rounded-md">
                  <p><strong>Leave Type:</strong> {request.leaveType}</p>
                  <p><strong>Start Date:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {request.leaveStatus}</p>
                  {request.leaveStatus === "approved" && (
                    <p className="text-green-500">Your leave has been approved. Please provide details of your stay before leaving.</p>
                  )}
                  {request.leaveStatus === "rejected" && (
                    <p className="text-red-500">Your leave has been rejected.</p>
                  )}
                  {/* <div className="mt-2 flex gap-2">
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
                  </div> */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
  </div>
  );
};

export default Requestleave;
