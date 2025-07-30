import React, { useState, useEffect, useRef } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";

const SupplierOrders = () => {
  const user = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = user.id;
  const [isVisible, setIsVisible] = useState(false);
  const [orders, setOrders] = useState([])
  const [orderStatus, setOrderStatus] = useState("")
  const [orderSupplierId, setOrderSupplierId] = useState(null);
  const [addToInventory, setAddToInventory] = useState({})
  const [inventoryAdded, setInventoryAdded] = useState({});
  const [seeOpns, setSeeOpns] = useState(false);
  const opnsRef = useRef(null);
  const [error, setError] = useState("");
  const [updateOrder, setUpdateOrder] = useState(false)
  const [deleteOrder, setDeleteOrder] = useState(null);

  const [newItem, setNewItem] = useState({
    adminId: JSON.parse(localStorage.getItem("laundry_admin")).id,
    itemName: "",
    itemQuantity: "",
    itemCategory: "utilitiesItems",
    orderStatus: "",
    content: ""
  });

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
      console.log("Admin ID:", adminId);

      const resp = await axios.get("http://localhost:5000/api/post-notifier");

      if (resp.status === 200) { // ✅ Corrected Status Check
        console.log("Response Data:", resp.data);

        setOrders(resp.data.data); // ✅ Assuming `data` is an array of orders

        // ✅ Set `orderStatus` from the first order if available
        if (resp.data.data.length > 0) {
          setOrderStatus(resp.data.data[0].orderStatus);
        }
      } else {
        console.log("Data not found");
      }

    } catch (error) {
      setError(error.message);
      console.error("Error fetching all Admin Orders:", error.response?.data || error.message);
      toast.error("Trouble loading details");
      console.log("Even with the Admin ID:", adminId);
    }
  };

  handleAllOrders();
}, []); // ✅ Dependency array remains empty (runs only on mount)

useEffect(() => {
  const addedInventoryItems = JSON.parse(localStorage.getItem('addedInventoryItems') || '{}');
  setInventoryAdded(addedInventoryItems);
}, []);

  const toggleDelete = (orderId) => {
    setDeleteOrder(orderId);
  };

  const handleDelete = async () => {
    try {
      if (!deleteOrder) {
        toast.error("Invalid order ID");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/post-notifier/${deleteOrder}`);
      
      if (response.data.success) {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== deleteOrder));
        toast.success("Order cancelled successfully", {autoClose: 2000});
        setDeleteOrder(null);
        setSeeOpns({});
      } else {
        toast.error("Failed to cancel order", {autoClose: 2000});
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An error occurred. Please try again.", {autoClose: 2000});
    }
  };

   const onClose =()=>{
    setUpdateOrder(false)
    setDeleteOrder(false)
    setOrderSupplierId(false)
    setNewItem({
      itemName: "",
      itemQuantity: "",
      itemPrice: "",
      itemCategory: "utilitiesItems",
      content: "",
      orderStatus: ""
    })
  }

  const handleOrderChange = (e) => {
    const { value, name } = e.target;
    setNewItem((prevState) => ({
    ...prevState,
    [name]: value,
    }));
    };


const updateOrderStatus = async (orderId, newStatus) => {
    try {
        await axios.put(`http://localhost:5000/api/post-notifier/${orderId}`, { orderStatus: newStatus });

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

const handleUpdateOrder = async (e, supplierId)=>{
  e.preventDefault()
  const newErrors = {};
    if (!newItem.itemName || newItem.itemName.trim().length < 2) {
      newErrors.itemName = "Item Name must be at least 2 characters long";
    }
    if (!newItem.itemQuantity || newItem.itemQuantity < 10) {
      newErrors.itemQuantity = "Must order 10 or more units";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
  
    let adminData = localStorage.getItem("laundry_admin");
    if (!adminData) {
      toast.error("Admin not found in local storage.");
      return;
    }
  
    const adminId = JSON.parse(adminData).id;
    const orderData = {
      adminId, // Ensure adminId exists
      supplierId, 
      itemName: newItem.itemName,
      itemQuantity: Number(newItem.itemQuantity), // Ensure it's a number
      itemPrice: newItem.itemQuantity, // Ensure it's a number
      itemCategory: newItem.itemCategory || "otherItems", // Ensure it's set
      content: newItem.content,
      orderStatus: "pending"
    };
  console.log("Here is the Admin Id: ", adminId)
  console.log("Here is the Supplier Id: ", supplierId)
  console.log("Sending order data:", orderData); // Log before sending
    try {
      const resp = await axios.post(
        "http://localhost:5000/api/post-notifier/supplier-notification",
        orderData
      );
  
      console.log(resp.data);
      console.log(newItem);
  
      if (resp.data.success) {
        toast.success("Order sent successfully!");
        
        // Corrected state update
        setNewItem({
          itemName: "",
          itemQuantity: "",
          itemPrice: "",
          content: "",
        });
  
        setOrderSupplierId(false);
      } else {
        toast.error("Something went wrong while placing Order");
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 403) {
          toast.warn("You do not have permission to access this resource.");
        } else if (error.response.status === 400) {
          toast.warn("Error submitting form");
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
  
      setNewItem({
        itemName: "",
        itemQuantity: "",
        itemPrice: "",
        content: "",
      });
    }
}
const handleAddToInventory = async(orderId, inventoryData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/users/admin/inventory", inventoryData);  
    if (response.status === 201) {
      // Get existing added inventory items from localStorage
      const addedInventoryItems = JSON.parse(localStorage.getItem('addedInventoryItems') || '{}');
      
      // Add the new orderId to the object
      addedInventoryItems[orderId] = true;
      
      // Save back to localStorage
      localStorage.setItem('addedInventoryItems', JSON.stringify(addedInventoryItems));
      
      // Update state
      setInventoryAdded((prev) => ({
        ...prev,
        [orderId]: true,
      }));
      
      toast.success("Item added successfully!", {autoClose:2000});
    } else {
      toast.error("Error Adding Item", {autoClose:2000});
      console.log("Error Posting to inventory", inventoryData)
    }
  } catch (error) {
    console.error("Error adding/updating item:", error);
    toast.error("Failed to add/update the item.");
  }
};


  return (
    <div className="fixed h-[80%] right-0 w-[62%] bg-gray-200 p-3">
        <div className="fixed z-10 top-0">
          </div>
        <div className="grid grid-cols-2 p-2 gap-2 h-[90%] overflow-y-scroll">       
        {orders && orders.length > 0 ? (
            [...orders]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort orders by latest first
              .map((order) => (
                <div 
                  className="bg-white border flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" 
                  key={order._id}
                >
                   {orderSupplierId && (
                    <div className="w-[80%] h-[85%] bg-black opacity-95 z-50 fixed top-20 right-5">
                    <p className="text-center mt-2 text-white">Fulfil Order Form</p>
                    <form action="" onSubmit={(e) => handleUpdateOrder(e, order._id)} className=" h-[90%] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-yellow-600">
                      <div className="w-full h-fit flex flex-col mx-auto mt-8 space-y-2">
                          <div className="flex flex-col items-center">
                            <input type="text" onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })} name="itemName" value={newItem.itemName} className="bg-white w-[30%] p-2 h-[60%] mx-auto rounded-lg" placeholder="Item Name" />
                            {error.itemName && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.itemName}</p>}
                          </div>
                          <div className="flex flex-col items-center">
                            <input type="number" onChange={(e) => setNewItem({ ...newItem, itemQuantity: e.target.value })} name="itemQuantity" value={newItem.itemQuantity} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Item Quantity"/>
                            {error.itemQuantity && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.itemQuantity}</p>}
                          </div>
                          <div className="flex flex-col items-center">
                            <input type="number" onChange={(e) => setNewItem({ ...newItem, itemPrice: e.target.value })} name="itemPrice" value={newItem.itemPrice} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Unit Price"/>
                            {error.itemPrice && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.itemPrice}</p>}
                          </div>
                          <div className="flex flex-col items-center">
                          <p className="w-[30%] bg-white h-[60%] p-2 mx-auto rounded-lg flex items-center">Total Price= <TbCurrencyNaira/>{newItem.itemPrice * newItem.itemQuantity}</p>
                          
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <select
                                className="bg-white w-[30%] p-2 h-[60%] mx-auto rounded-lg"
                                value={newItem.itemCategory}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, itemCategory: e.target.value })
                                }                                >
                                <option value="otherItems">Select Category</option>
                                <option value="cleaningItems">Cleaning Items</option>
                                <option value="packagingItems">Packaging Items</option>
                                <option value="equipmentItems">All Equipment</option>
                                <option value="utilitiesItems">Utilities</option>
                                <option value="safetyItems">Safety Items</option>
                            </select>
                          </div>
                          <div className="flex flex-col items-center">
                            <textarea onChange={(e) => setNewItem({ ...newItem, content: e.target.value })} name="content" value={newItem.content} className="w-[30%] h-[60%] p-2 mx-auto rounded-lg" placeholder="Details, e.g expected delivery time"/>
                            {error.content && <p className="text-red-500 text-xs mt-1 w-[30%] mx-auto">{error.content}</p>}
                          </div>
                      </div>
                      
                      <div className="mx-auto mt-5 w-[30%] flex gap-5">
                          <button className="bg-yellow-600 text-white p-2 text-center rounded w-full">Submit</button>
                          <p onClick={onClose} className="text-white text-center flex p-3 border w-fit rounded cursor-pointer">Close</p>
                      </div>
                    </form>
                  </div>
                  )}
                  {/* Order Status & Actions */}
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-md text-white w-fit ${
                      order.orderStatus === "Pending" ? "bg-yellow-500" :
                      order.orderStatus === "Completed" ? "bg-gradient-to-r from-yellow-500 to-green-500" :
                      order.orderStatus === "Verified" ? "bg-green-500" :
                      order.orderStatus === "Cancelled" ? "bg-red-500" : "bg-gray-500"
                      
                    }`}>
                      {order.orderStatus}      
                    </span>

                    {/* Options Menu */}
                    <BsThreeDotsVertical className="text-black cursor-pointer" onClick={() => toggleOpns(order._id)} />
                    {seeOpns[order._id] && (
                      <div className="flex flex-col rounded-lg bg-gray-300 border absolute top-12 right-5 z-10" ref={opnsRef}>
                        <ul>
                        {order.orderStatus !== "Verified" && (
                            <li
                              className="border-b p-2 cursor-pointer text-green-700 text-sm"
                              onClick={() => updateOrderStatus(order._id, "Verified")}
                            >
                              Confirm Completion
                            </li>
                        )}
                        {order.orderStatus === "Verified" && !inventoryAdded[order._id] && (
                          <li className="p-1 cursor-pointer text-blue-700 text-sm" onClick={()=>{ 
                            const inventoryData = {
                              itemName: order.itemName,
                              itemPrice: order.itemPrice || "N/A",
                              itemQuantity: order.itemQuantity || "N/A",
                              itemImage: "default-item-image.jpg",
                              itemCategory: order.itemCategory || "N/A"
                            }
                            handleAddToInventory(order._id, inventoryData)}}>
                              Add to Inventory
                          </li>
                        )}
                          <li
                            className="text-red-700 p-2 cursor-pointer text-sm"
                            onClick={() => toggleDelete(order._id)}
                          >
                            Cancel Order
                          </li>
                        </ul>
                        
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="p-2 mt-4 rounded-lg bg-gray-300 font-semibold flex flex-col">
                    {/* Order Date */}
                    <div className="flex justify-between items-center text-gray-600">
                      <p className="text-sm">Order Date:</p>
                      <p className="text-sm">{order.createdAt?.split("T")[0]}</p>
                    </div>

                    {/* Service Details */}
                    <div className="flex flex-col font-semibold w-full mt-2">
                      <div className="flex flex-col justify-between text-left border my-3 w-full px-2 py-2 bg-white">
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Supplier Name</p>
                            <p className="text-sm font-medium text-gray-700">{order.supplierId?.firstName || "N/A"} {order.supplierId?.lastName || ""}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Item Name</p>
                            <p className="text-sm font-medium text-gray-700">{order.itemName || "N/A"}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Item Category</p>
                            <p className="text-sm font-medium text-gray-700">{order.itemCategory || "N/A"}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Item Quantity</p>
                            <p className="text-sm font-medium text-gray-700">{order.itemQuantity || "N/A"}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Item Price</p>
                            <p className="text-sm font-medium text-gray-700">{order.itemPrice || "N/A"}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Total Price</p>
                            <p className="text-sm font-medium text-gray-700">{(order.itemPrice * order.itemQuantity ) || "N/A"}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Remarks</p>
                            <p className="text-sm font-medium text-gray-700">{order.content || "N/A"}</p>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>  
              ))
          ) : (
            <p className="text-center text-gray-500">No Orders Found</p>
          )}


        </div>
        {deleteOrder && (
          <div className="fixed w-full top-0 h-[100vh] left-[260px] z-10 bg-black opacity-90 p-6 rounded shadow-lg text-center">
            <div className="mt-[15vh] flex flex-col relative">
              <p className="text-white">Are you sure you want to cancel this supplier order? Action is <strong className="text-red-700">irreversible!!</strong></p>
              <div className="flex gap-5 mx-auto mt-10 items-center">
                <button 
                  onClick={handleDelete} 
                  className="bg-red-500 border-2 border-black hover:border-red-800 hover:text-red-950 hover:animate-pulse text-white font-semibold rounded-lg p-2 w-fit h-fit"
                >
                  Cancel Order
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
    </div>
  );
};

export default SupplierOrders;
