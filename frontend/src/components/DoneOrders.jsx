import React, { useState, useEffect, useRef } from "react";
import { FaThumbsUp } from "react-icons/fa";

import bubbles1 from "../PNG/bubble.png"
import bubbles2 from "../PNG/bubbly.png"
import bubbles3 from "../PNG/bubbles.png"
import bubbles4 from "../PNG/washing-machine.png"
import bubbles5 from "../PNG/steam-iron.png"
import bubbles6 from "../PNG/water-bubble.png"
import { Link } from "react-router-dom";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";

const DoneOrders = () => {
  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = loggedUser.id;
  const [isVisible, setIsVisible] = useState(false);
  const [orders, setOrders] = useState([])
  const [orderStatus, setOrderStatus] = useState("")
  const [seeOpns, setSeeOpns] = useState(false);
  const opnsRef = useRef(null);
  const [error, setError] = useState("");
  const [updateOrder, setUpdateOrder] = useState(false)
  const [deleteOrder, setDeleteOrder] = useState(false)

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
    setTimeout(() => setIsVisible(true), 200); // Small delay before animation starts
  }, []);

  const toggleOpns = (orderId) => {
    setSeeOpns((prev) => ({
      ...prev,
      [orderId]: !prev[orderId], // Toggle specific customer's options
    }));
  };

  useEffect(() => {
    const handleAllOrders = async () => {
      try {
        if (!adminId) return; // Ensure adminId exists before making the request
  
        console.log("Admin ID:", adminId);
  
        const resp = await axios.get("http://localhost:5000/api/orders/all");
        if (Array.isArray(resp.data.data)) {
          setOrders(
            resp.data.data.filter(order => 
              order.orderStatus === "Completed"
            )
          );
        } else {
          console.error("Unexpected data format:", resp.data);
        }
        // setOrders(resp.data.data)
        setOrderStatus(resp.data.status)
        console.log(resp.data);
        // toast.loading("Loading", {autoClose: 3000})
  
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
  
    handleAllOrders();
  }, [adminId]); // Runs whenever adminId changes

  const doUpdateOrder = ()=>{
    setUpdateOrder(true)
  }

  const toggleDelete = ()=>{
    setDeleteOrder(true)
  }

  const onClose =()=>{
    setUpdateOrder(false)
    setDeleteOrder(false)
  }

  return (
    <div className="fixed h-[80%] right-0 w-[62%] bg-gray-200 p-3">
        <div className="fixed z-10 top-0">
          {updateOrder && (
            <div className="fixed w-full h-[100vh] z-10 bg-black opacity-90 p-6 rounded shadow-lg text-center">
              <div className="mt-[15vh] flex flex-col relative">
                  <form action="" className="mx-auto flex flex-col gap-2">
                    <div className="flex flex-col">
                      <label className="text-white text-left text-sm">First Name</label><input type="text" className=" rounded-lg p-2 w-full" placeholder="First Name" /></div>
                    <div className="flex flex-col">
                      <label className="text-white text-left text-sm">Last Name</label><input type="text" className=" rounded-lg p-2 w-full" placeholder="Last Name" /></div>
                    <div className="flex flex-col">
                      <label className="text-white text-left text-sm">Email</label><input type="text" className=" rounded-lg p-2 w-full" placeholder="Email" /></div>
                    <div className="flex flex-col">
                      <label className="text-white text-left text-sm">Address</label><input type="text" className=" rounded-lg p-2 w-full" placeholder="Address" /></div>
                    <div className="flex flex-col">
                      <label className="text-white text-left text-sm">Date of Birth</label><input type="text" className=" rounded-lg p-2 w-full" placeholder="D.O.B" /></div>
                    <div className="flex flex-col">
                      <label className="text-white text-left text-sm">Avatar</label><input type="file" className=" rounded-lg p-2 w-full" placeholder="Avatar" /></div>
                    <button className="bg-orange-800 text-white font-semibold rounded-lg p-2 w-fit h-fit">Submit</button>
                  </form>
                  <button className="p-3 border w-fit mx-auto rounded-3xl mt-5 text-white absolute bottom-5 right-[30%]" onClick={onClose}>Close</button>
                </div>
              </div>
            )}
            {deleteOrder && (
              <div className="fixed w-full h-[100vh] z-10 bg-black opacity-90 p-6 rounded shadow-lg text-center">
                <div className="mt-[15vh] flex flex-col relative items-center w-[80%]">
                  <p className="text-white">Are you sure you want to delete this employee's Order? Action is <strong className="text-red-700">irreversible!!</strong></p>
                  <div className="flex gap-5 mx-auto mt-10 items-center">
                    <button onClick={toggleDelete} className="bg-red-500 border-2 border-black hover:border-red-800 hover:text-red-950 hover:animate-pulse text-white font-semibold rounded-lg p-2 w-fit h-fit">Delete</button>
                    <button className="rounded-lg p-2 w-fit h-fit border mx-auto text-white" onClick={onClose}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        <div className="grid grid-cols-3 p-2 gap-2 h-[90%] overflow-y-scroll">
        {orders && orders.length > 0 ? (
           [...orders]
           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
              <div className="bg-white h-fit border flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" key={order._id}>
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-2 py-1 rounded-md text-white w-fit ${
                    order.orderStatus === "Pending" ? "bg-yellow-500" :
                    order.orderStatus === "Completed" ? "bg-green-500" :
                    order.orderStatus === "Cancelled" ? "bg-red-500" : "bg-gray-500"
                  }`}>
                    {order.orderStatus}
                  </span>
                  <p className="flex rounded-lg p-1 border-2 items-center"><TbCurrencyNaira/>{order.totalCost}</p>
                </div>
                
                <div className="flex justify-end">
                  {/* <img className="size-20 border rounded-full object-cover" alt="IMAGES" /> */}
                  <BsThreeDotsVertical className="text-black" onClick={()=> toggleOpns(order._id)}/>
                  {seeOpns[order._id] && (
                    <div className="flex flex-col rounded-lg bg-gray-300 border absolute top-12 right-5" ref={opnsRef}>
                      <ul>
                        {/* <li className="border-b p-2 cursor-pointer text-blue-900" onClick={()=>doUpdateOrder(order._id)}>Update Info</li> */}
                        <li className="text-red-700 p-2 cursor-pointer" onClick={()=>toggleDelete(order._id)}>Delete Info</li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="text-black">
                  <p className="mb-2 font-semibold">Contact Info:</p>
                  <p className="text-sm flex items-center gap-3">Username: {order.userId.username}</p>
                  <p className="flex items-center gap-3"><MdEmail />{order.userId.email}</p>
                  <p className="flex items-center gap-3"><BiPhone />{order.userId.phone}</p>
                </div>
              </div>
              <div className="p-2 mt-4 rounded-lg bg-gray-300 font-semibold">
                <div className="flex justify-between items-center text-gray-600">
                  <p className="text-sm">Service Type(s)</p>
                  <p className="text-sm">Order Date</p>
                </div>
                <div className="flex justify-between font-semibold">
                  <div className="text-sm">
                    {order.serviceType.map((category, index) => (
                      <p key={index}>{category.category}</p>
                    ))}
                    {order.paymentStatus === 'paid' && (
                      <div className="flex items-center gap-1 text-green-600 mt-2">
                        <span>Paid</span>
                        <FaThumbsUp />
                      </div>
                    )}
                  </div>
                  <p className="text-sm">{order.createdAt.split("T")[0]}</p>
                </div>
              </div>
              </div>  
          ))
          ) : (
          "No Orders Found"
          )}  
        </div>
    </div>
  );
};

export default DoneOrders;
