import React, { useState, useEffect, useRef } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";

const PendingOrders = () => {
  const user = JSON.parse(localStorage.getItem("laundry_employee_loggedUser"))
  const employeeId = user.id;
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
        if (!employeeId) return; // Ensure employeeId exists before making the request
  
        console.log("Admin ID:", employeeId);
  
        const resp = await axios.get(`http://localhost:5000/api/orders/employee/${employeeId}`);
        setOrders(resp.data.data)
        setOrderStatus(resp.data.orderStatus)
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
          console.log("Data not found");
        }
  
      } catch (error) {
        setError(error.message);
        console.error("Error fetching all employees:", error.response?.data || error.message);
        toast.error("Trouble loading details");
      }
    };
  
    handleAllOrders();
  }, [employeeId]); // Runs whenever employeeId changes

//   const doUpdateOrder = ()=>{
//     setUpdateOrder(true)
//   }

  const toggleDelete = ()=>{
    setDeleteOrder(true)
  }

  const onClose =()=>{
    setUpdateOrder(false)
    setDeleteOrder(false)
  }

//   const doUpdateOrder = async (orderId) => {
//     try {
//         await axios.put(`http://localhost:5000/api/orders/edit/${orderId}`, { orderStatus: "Processing" });

//         setOrders((prevOrders) =>
//             prevOrders.map((order) =>
//                 order._id === orderId ? { ...order, orderStatus: "Processing" } : order
//             )
//         );
//         toggleOpns(orderId); // Close the dropdown
//     } catch (error) {
//         console.error("Error updating order status:", error);
//     }
// };
const updateOrderStatus = async (orderId, newStatus) => {
    try {
        await axios.put(`http://localhost:5000/api/orders/edit/${orderId}`, { orderStatus: newStatus });

        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId ? { ...order, orderStatus: newStatus } : order
            )
        );
        toggleOpns(orderId);
    } catch (error) {
        console.error("Error updating order status:", error);
    }
};


  return (
    <div className="fixed mt-1 h-[75%] right-0 w-[71%] bg-gray-200 p-3">
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
                <div className="mt-[15vh] flex flex-col relative w-[80%] items-center">
                  <p className="text-white">Are you sure you want to delete this employee's Order? Action is <strong className="text-red-700">irreversible!!</strong></p>
                  <div className="flex gap-5 mx-auto mt-10 items-center">
                    <button onClick={toggleDelete} className="bg-red-500 border-2 border-black hover:border-red-800 hover:text-red-950 hover:animate-pulse text-white font-semibold rounded-lg p-2 w-fit h-fit">Delete</button>
                    <button className="rounded-lg p-2 w-fit h-fit border mx-auto text-white" onClick={onClose}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        <div className="grid grid-cols-2 p-2 gap-2 h-[90%] overflow-y-scroll">
        {orders && orders.length > 0 ? (
          [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort orders by latest first
            .map((order) => (
              <div className="bg-white border flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" key={order._id}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-md text-white w-fit ${
                        order.orderStatus === "Pending" ? "bg-yellow-500" :
                        order.orderStatus === "Completed" ? "bg-green-500" :
                        order.orderStatus === "Cancelled" ? "bg-red-500" : "bg-gray-500"
                      }`}>
                      {order.orderStatus}      
                    </span>
                    <BsThreeDotsVertical className="text-black" onClick={() => toggleOpns(order._id)} />
                    {seeOpns[order._id] && (
                      <div className="flex flex-col rounded-lg bg-gray-300 border absolute top-12 right-5" ref={opnsRef}>
                        <ul>
                          {order.orderStatus !== "Processing" && (
                            <li
                              className="border-b p-2 cursor-pointer text-blue-900 text-sm"
                              onClick={() => updateOrderStatus(order._id, "Processing")}
                            >
                              Accept Job
                            </li>
                          )}
                          {order.orderStatus !== "Completed" && (
                            <li
                              className="border-b p-2 cursor-pointer text-green-700 text-sm"
                              onClick={() => updateOrderStatus(order._id, "Completed")}
                            >
                              Mark as Completed
                            </li>
                          )}
                          {/* <li
                            className="text-red-700 p-2 cursor-pointer text-sm"
                            onClick={() => toggleDelete(order._id)}
                          >
                            Delete Info
                          </li> */}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2 mt-4 rounded-lg bg-gray-300 font-semibold flex flex-col">
                  <div className="flex justify-between h-fit items-center text-gray-600">
                    <p className="text-sm">Order Date</p>
                    <p className="text-sm">{order.createdAt.split("T")[0]}</p>
                  </div>
                  <div className="flex flex-col font-semibold w-full">
                    <div className="text-sm w-full">
                      <p className="text-sm text-center">Service Type(s)</p>
                      {order.serviceType.map((category) => (
                        <div className="flex justify-between items-center border my-3 w-full px-2 py-2" key={category.category}>
                          <p className="w-1/4">{category.category}</p>
                          <div className="flex flex-col w-1/3">
                            <p>Adult Clothes: {category.adultGarments}</p>
                            <p>Kids Clothes: {category.kidsGarments}</p>  
                          </div>
                          <div className="w-1/3">
                            <p>Deadline: {category.adultsPickupOption && category.adultsPickupOption !== " " ? category.adultsPickupOption : "2wks"}</p>
                            <p>Deadline: {category.kidsPickupOption && category.kidsPickupOption !== " " ? category.kidsPickupOption : "2wks"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default PendingOrders;
