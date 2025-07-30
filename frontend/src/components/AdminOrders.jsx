import React, { useState, useEffect, useRef } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { TbCurrencyNaira } from "react-icons/tb";

const AdminOrders = () => {
  const user = JSON.parse(localStorage.getItem("laundry_admin"))
  const adminId = user.id;
  const [isVisible, setIsVisible] = useState(false);
  const [orders, setOrders] = useState([])
  const [orderStatus, setOrderStatus] = useState("")
  const [orderSupplierId, setOrderSupplierId] = useState(null);
  const [seeOpns, setSeeOpns] = useState(false);
  const opnsRef = useRef(null);
  const [error, setError] = useState("");
  const [updateOrder, setUpdateOrder] = useState(false)
  const [deleteOrder, setDeleteOrder] = useState(false)

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

  const sup = localStorage.getItem("laundry_supplier_loggedUser")
  const supplier = JSON.parse(sup).id

useEffect(() => {
  const handleAllOrders = async (supplierId) => {
    try {
      console.log("Admin ID:", adminId);

      const resp = await axios.get(`http://localhost:5000/api/post-notifier`);
      const supplierOrder = resp.data.data.filter(
        order => order.supplierId._id === supplier
      )
      if (resp.status === 200) {
        console.log("Response Data:", resp.data);
        setOrders(supplierOrder);

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


  const toggleDelete = ()=>{
    setDeleteOrder(true)
  }

  // const handleOrder = async (e, supplierId) => {
  //   e.preventDefault();
  
  //   const newErrors = {};
  //   if (!newItem.itemName || newItem.itemName.trim().length < 2) {
  //     newErrors.itemName = "Item Name must be at least 2 characters long";
  //   }
  //   if (!newItem.itemQuantity || newItem.itemQuantity < 10) {
  //     newErrors.itemQuantity = "Must order 10 or more units";
  //   }
  
  //   if (Object.keys(newErrors).length > 0) {
  //     setError(newErrors);
  //     return;
  //   }
  
  //   let adminData = localStorage.getItem("laundry_admin");
  //   if (!adminData) {
  //     toast.error("Admin not found in local storage.");
  //     return;
  //   }
  
  //   const adminId = JSON.parse(adminData).id;
  //   const orderData = {
  //     adminId, // Ensure adminId exists
  //     supplierId, 
  //     itemName: newItem.itemName,
  //     itemQuantity: Number(newItem.itemQuantity), // Ensure it's a number
  //     itemPrice: newItem.itemQuantity, // Ensure it's a number
  //     itemCategory: newItem.itemCategory || "otherItems", // Ensure it's set
  //     content: newItem.content,
  //     orderStatus: "Pending"
  //   };
  // console.log("Here is the Admin Id: ", adminId)
  // console.log("Here is the Supplier Id: ", supplierId)
  // console.log("Sending order data:", orderData); // Log before sending
  //   try {
  //     const resp = await axios.post(
  //       "http://localhost:5000/api/post-notifier",
  //       orderData
  //     );
  
  //     console.log(resp.data);
  //     console.log(newItem);
  
  //     if (resp.data.success) {
  //       toast.success("Order sent successfully!");
        
  //       // Corrected state update
  //       setNewItem({
  //         itemName: "",
  //         itemQuantity: "",
  //         itemPrice: "",
  //         content: "",
  //       });
  
  //       setOrderSupplierId(false);
  //     } else {
  //       toast.error("Something went wrong while placing Order");
  //       alert("Something went wrong");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     if (error.response) {
  //       if (error.response.status === 403) {
  //         toast.warn("You do not have permission to access this resource.");
  //       } else if (error.response.status === 400) {
  //         toast.warn("Error submitting form");
  //       }
  //     } else {
  //       toast.error("An error occurred. Please try again.");
  //     }
  
  //     setNewItem({
  //       itemName: "",
  //       itemQuantity: "",
  //       itemPrice: "",
  //       content: "",
  //     });
  //   }
  // };

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

// const handleUpdateOrder = async (e, orderId)=>{
//   e.preventDefault()
//   const newErrors = {};
//     if (!newItem.itemName || newItem.itemName.trim().length < 2) {
//       newErrors.itemName = "Item Name must be at least 2 characters long";
//     }
//     if (!newItem.itemQuantity || newItem.itemQuantity < 10) {
//       newErrors.itemQuantity = "Must order 10 or more units";
//     }
  
//     if (Object.keys(newErrors).length > 0) {
//       setError(newErrors);
//       return;
//     }
  
//     let adminData = localStorage.getItem("laundry_admin");
//     if (!adminData) {
//       toast.error("Admin not found in local storage.");
//       return;
//     }
  
//     const adminId = JSON.parse(adminData).id;
//     const orderData = {
//       adminId: newItem.adminId, // Ensure adminId exists
//       supplierId: newItem.supplierId, 
//       itemName: newItem.itemName,
//       itemQuantity: Number(newItem.itemQuantity), // Ensure it's a number
//       itemPrice: newItem.itemPrice, // Ensure it's a number
//       itemCategory: newItem.itemCategory || "otherItems", // Ensure it's set
//       content: newItem.content,
//       orderStatus: "Pending"
//     };
//     try {
//       const resp = await axios.put(
//         `http://localhost:5000/api/post-notifier/${orderId}`,
//         orderData,
//       );
  
//       console.log(resp.data);
//       console.log(newItem);
  
//       if (resp.data.success) {
//         toast.success("Order sent successfully!");  
//         setOrderSupplierId(false);
//         updateOrderStatus(orderId, "Processing");
//       } else {
//         toast.error("Something went wrong while placing Order");
//         alert("Something went wrong");
//         setNewItem({
//           itemName: "",
//           itemQuantity: "",
//           itemPrice: "",
//           content: "",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       if (error.response) {
//         if (error.response.status === 403) {
//           toast.warn("You do not have permission to access this resource.");
//         } else if (error.response.status === 400) {
//           toast.warn("Error submitting form");
//           setNewItem({
//             itemName: "",
//             itemQuantity: "",
//             itemPrice: "",
//             content: "",
//           });
//         }
//       } else {
//         toast.error("An error occurred. Please try again.");
//         setNewItem({
//           itemName: "",
//           itemQuantity: "",
//           itemPrice: "",
//           content: "",
//         });
//       }
  
//     }
// }

const handleUpdateOrder = async (e, orderId) => {
  e.preventDefault();

  try {
    const updatedOrder = {
      ...orders.find(order => order._id === orderId),
      orderStatus: "Processing",
      itemName: newItem.itemName,
      itemQuantity: newItem.itemQuantity,
      itemPrice: newItem.itemPrice,
      itemCategory: newItem.itemCategory,
      content: newItem.content,
    };

    // Update backend
    await axios.put(`http://localhost:5000/api/post-notifier/${orderId}`, updatedOrder);

    // Update frontend state
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? updatedOrder : order
      )
    );

    setOrderSupplierId(false);
  } catch (error) {
    console.error("Error updating order:", error);
    toast.error("Error updating order");
  }
};

// ✅ Call this when 'Accept Order' is clicked
const acceptOrder = (order) => {
  setOrderSupplierId(order._id); // Track which order's form is open
  setNewItem({
    itemName: order.itemName || "",
    itemQuantity: order.itemQuantity || "",
    itemPrice: order.itemPrice || "",
    itemCategory: order.itemCategory || "",
    content: order.content || "",
  });
};



  return (
    <div className="fixed h-[76%] right-0 w-[70%] mt-1 bg-gray-200 p-3">
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
                <div className="mt-[15vh] flex flex-col relative">
                  <p className="text-white">Are you sure you want to delete this supplier's Order? Action is <strong className="text-red-700">irreversible!!</strong></p>
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
                <div 
                  className="bg-white border flex flex-col shadow-md rounded-lg p-4 w-full mx-auto relative" 
                  key={order._id}
                >
                   {orderSupplierId === order._id && (
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
                          {order.orderStatus !== "Processing" && (
                            <li
                              className="border-b p-2 cursor-pointer text-blue-900 text-sm"
                              onClick={() => {
                                // updateOrderStatus(order._id, "Processing");
                                setOrderSupplierId(order._id);
                                  setNewItem({
                                    itemName: order.itemName,
                                    itemQuantity: order.itemQuantity,
                                    itemPrice: order.itemPrice || "", // Ensure it's not undefined
                                    itemCategory: order.itemCategory || "", // Ensure it's not undefined
                                    content: order.content || "",
                                  });
                                  setOrderSupplierId(order._id); // Show the form
                              }}
                              
                            >
                              Accept Order
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
                          <li
                            className="text-red-700 p-2 cursor-pointer text-sm"
                            onClick={() => toggleDelete(order._id)}
                          >
                            Reject Order
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
                      <div className="flex flex-col justify-between border my-3 w-full px-2 py-2 bg-white">
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Admin Name:</p>
                            <p className="text-sm font-medium text-gray-700">{order.adminId?.firstName || "N/A"} {order.adminId?.lastName || ""}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Item Name:</p>
                            <p className="text-sm font-medium text-gray-700">{order.itemName || "N/A"}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Item Quantity:</p>
                            <p className="text-sm font-medium text-gray-700">{order.itemQuantity || "N/A"}</p>
                        </div>
                        <div className="gap-2 px-1 flex">
                            <p className="text-sm text-gray-700 font-bold">Remarks:</p>
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
    </div>
  );
};

export default AdminOrders;
