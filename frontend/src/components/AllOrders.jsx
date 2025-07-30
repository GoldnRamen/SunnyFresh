import React, { useState, useEffect, useRef } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";

const AllOrders = () => {
  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = loggedUser.id;
  const [isVisible, setIsVisible] = useState(false);
  const [orders, setOrders] = useState([])
  const [orderStatus, setOrderStatus] = useState("")
  const [seeOpns, setSeeOpns] = useState(false);
  const opnsRef = useRef(null);
  const [error, setError] = useState("");
  const [updateOrder, setUpdateOrder] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

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
        }
  
      } catch (error) {
        setError(error.message);
        console.error("Error fetching all employees:", error.response?.data || error.message);
        toast.error("Trouble loading details");
      }
    };
  
    handleAllOrders();
  }, [adminId]); // Runs whenever adminId changes

  const doUpdateOrder = (order) => {
    setOrderToUpdate(order);
    setUpdateOrder(true);
  };

  const toggleDelete = (orderId) => {
    setDeleteOrder(orderId);
  };

  const handleDelete = async () => {
    try {
      if (!deleteOrder) {
        toast.error("Invalid order ID");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/orders/remove/${deleteOrder}`);
      
      if (response.data.success) {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== deleteOrder));
        toast.success("Order deleted successfully", {autoClose: 2000});
        setDeleteOrder(null);
        setSeeOpns({});
      } else {
        toast.error("Failed to delete order", {autoClose: 2000});
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An error occurred. Please try again.", {autoClose: 2000});
    }
  };

  const onClose =()=>{
    setUpdateOrder(false)
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/employee/all');
        setEmployees(response.data.data.filter(user => user.role === "employee"));
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Could not load employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleAssignOrder = async (orderId) => {
    setSelectedOrder(orderId);
    setShowAssignModal(true);
  };

  const submitAssignment = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/assign/${selectedOrder}`, {
        employeeId: selectedEmployee
      });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrder 
            ? { ...order, assignedTo: selectedEmployee }
            : order
        )
      );
      
      toast.success('Order assigned successfully');
      setShowAssignModal(false);
      setSelectedEmployee('');
    } catch (error) {
      console.error('Error assigning order:', error);
      toast.error('Failed to assign order');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/edit/${orderToUpdate._id}`, {
        orderStatus: e.target.orderStatus.value,
        totalCost: parseFloat(e.target.totalCost.value),
        serviceType: orderToUpdate.serviceType.map((service, index) => ({
          ...service,
          garments: parseInt(e.target[`quantity-${index}`].value),
          cost: parseFloat(e.target[`cost-${index}`].value)
        }))
      });

      if (response.data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderToUpdate._id ? response.data.data : order
          )
        );
        
        toast.success("Order updated successfully");
        setUpdateOrder(false);
        setOrderToUpdate(null);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="fixed h-[80%] right-0 w-[62%] bg-gray-200 p-3">
        <div className="fixed z-10 top-0">
          {updateOrder && (
            <div className="fixed left-[260px] w-full h-[100vh] top-0 z-10 bg-black opacity-90 p-6 rounded shadow-lg text-center">
              <div className="mt-[15vh] flex flex-col items-center w-[80%] relative h-[80%]">
                <form className="flex flex-col gap-4 w-full max-w-4xl overflow-y-scroll" onSubmit={handleUpdateSubmit}>
                  {/* Header Section */}
                  <div className="bg-orange-800 p-4 rounded-t-lg">
                    <h2 className="text-white text-xl font-bold text-center">Update Order Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Order Status */}
                      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                        <label className="text-white text-left text-sm font-semibold mb-2 block">Order Status</label>
                        <select 
                          name="orderStatus"
                          className="rounded-lg p-3 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                          defaultValue={orderToUpdate?.orderStatus}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      {/* Total Cost */}
                      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                        <label className="text-white text-left text-sm font-semibold mb-2 block">Total Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-600">₦</span>
                          <input 
                            type="number" 
                            name="totalCost"
                            className="rounded-lg p-3 pl-8 w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                            defaultValue={orderToUpdate?.totalCost}
                          />
                        </div>
                      </div>
                      
                      {/* Customer Information */}
                      {orderToUpdate?.userId && (
                        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                          <h3 className="text-white font-semibold mb-2">Customer Information</h3>
                          <div className="text-gray-200 space-y-1">
                            <p className="flex items-center gap-2">
                              <span className="text-orange-300">Username:</span> 
                              {orderToUpdate.userId.username}
                            </p>
                            <p className="flex items-center gap-2">
                              <MdEmail className="text-orange-300" /> 
                              {orderToUpdate.userId.email}
                            </p>
                            <p className="flex items-center gap-2">
                              <BiPhone className="text-orange-300" /> 
                              {orderToUpdate.userId.phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Column - Service Items */}
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Service Items</h3>
                      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                        {orderToUpdate?.serviceType.map((service, index) => (
                          <div key={index} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-orange-300 font-medium">{service.category}</h4>
                              <span className="bg-orange-800 text-white text-xs px-2 py-1 rounded-full">Item {index + 1}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col">
                                <label className="text-white text-xs mb-1">Quantity</label>
                                <input 
                                  type="number" 
                                  name={`quantity-${index}`}
                                  className="rounded-lg p-2 w-full border border-gray-600 focus:border-orange-500"
                                  defaultValue={service.garments || service.adultGarments}
                                />
                              </div>
                              
                              <div className="flex flex-col">
                                <label className="text-white text-xs mb-1">Cost</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-gray-600 text-sm">₦</span>
                                  <input 
                                    type="number" 
                                    name={`cost-${index}`}
                                    className="rounded-lg p-2 pl-6 w-full border border-gray-600 focus:border-orange-500"
                                    defaultValue={service.cost}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer with Actions */}
                  <div className="flex justify-between items-center mt-4 p-4 bg-gray-800 bg-opacity-30 rounded-b-lg">
                    <button 
                      type="button"
                      onClick={() => {
                        setUpdateOrder(false);
                        setOrderToUpdate(null);
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Update Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {deleteOrder && (
            <div className="fixed w-full h-[100vh] left-[260px] z-10 bg-black opacity-90 p-6 rounded shadow-lg text-center">
              <div className="mt-[15vh] flex flex-col relative">
                <p className="text-white">Are you sure you want to delete this customer's order? Action is <strong className="text-red-700">irreversible!!</strong></p>
                <div className="flex gap-5 mx-auto mt-10 items-center">
                  <button 
                    onClick={handleDelete} 
                    className="bg-red-500 border-2 border-black hover:border-red-800 hover:text-red-950 hover:animate-pulse text-white font-semibold rounded-lg p-2 w-fit h-fit"
                  >
                    Delete
                  </button>
                  <button 
                    className="rounded-lg p-2 w-fit h-fit border mx-auto text-white" 
                    onClick={() => setDeleteOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {showAssignModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Assign Order</h2>
                <select 
                  className="w-full p-2 border rounded mb-4"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select an employee</option>
                  {employees.map(employee => (
                    <option key={employee._id} value={employee._id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button 
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setShowAssignModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={submitAssignment}
                    disabled={!selectedEmployee}
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 p-2 gap-2 h-[90%] overflow-y-scroll">
        {orders && orders.length > 0 ? (
           [...orders]
           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
              <div className="bg-white border flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" key={order._id}>
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
                        <li className="border-b p-2 cursor-pointer text-blue-900" onClick={() => doUpdateOrder(order)}>Update Info</li>
                        <li 
                          className="text-red-700 p-2 cursor-pointer" 
                          onClick={() => toggleDelete(order._id)}
                        >
                          Delete Info
                        </li>
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
                    {order.serviceType.map((category)=>(
                      <p>{category.category}</p>
                    ))}

                  </div>
                  <p className="text-sm">{order.createdAt.split("T")[0]}</p>
                </div>
              </div>
              {order.orderStatus === "Pending" ?
              (<button
              onClick={() => handleAssignOrder(order._id)}
              className="mt-4 w-40 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
            >
              Assign to Employee
            </button>)
            :
            null
              }
              </div>  
          ))
          ) : (
          "No Orders Found"
          )} 
      </div>
    </div>
  );
};

export default AllOrders;
