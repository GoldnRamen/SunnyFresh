import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate} from "react-router-dom"

import logo from "../PNG/household.png"
import profile from "../PNG/wBwFnhsaRXyqZk-TcOvz3w.webp"
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosPeople, IoMdNotifications } from "react-icons/io";
import { GiBiceps, GiSoap } from "react-icons/gi";
import { LiaStoreAltSolid } from "react-icons/lia";

const Inventory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: "",
        itemPrice: "",
        itemQuantity: "",
        itemImage: "default-item-image.jpg",
        itemCategory: "utilitiesItems",
    });
    const [editingItem, setEditingItem] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = "http://localhost:5000/api/users/admin/inventory";

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get(baseUrl);
                const inventoryData = response.data.data;

                if (Array.isArray(inventoryData)) {
                    setInventory(inventoryData);
                } else {
                    console.error("API response is not an array:", inventoryData);
                    throw new Error("API response is not an array");
                }
            } catch (err) {
                console.error("Error fetching inventory:", err);
                setError("Failed to load inventory");
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const handleAddOrEditItem = async () => {
        if (!newItem.itemName || !newItem.itemPrice || !newItem.itemQuantity) {
            toast.error("All fields are required!");
            return;
        }

        const itemData = {
            ...newItem,
            itemPrice: parseFloat(newItem.itemPrice),
            itemQuantity: parseInt(newItem.itemQuantity, 10),
        };

        const url = editingItem
            ? `${baseUrl}/edit/${editingItem._id}`
            : `${baseUrl}/`;

        const method = editingItem ? "PUT" : "POST";

        try {
            const response = await axios({
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                },
                data: itemData,
            });

            const updatedItem = response.data;

            if (editingItem) {
                setInventory((prev) =>
                    prev.map((item) => (item._id === editingItem._id ? updatedItem : item))
                );
                toast.success("Item updated successfully!");
            } else {
                setInventory((prev) => [...prev, updatedItem]);
                toast.success("Item added successfully!");
            }

            setNewItem({
                itemName: "",
                itemPrice: "",
                itemQuantity: "",
                itemImage: "default-item-image.jpg",
                itemCategory: "utilitiesItems",
            });
            setEditingItem(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding/updating item:", error);
            toast.error("Failed to add/update the item.");
        }
    };

    const handleDeleteItem = async (id) => {
        if (!id) {
            toast.error("Invalid item ID.");
            return;
        }
        try {
            await axios.delete(`${baseUrl}/remove/${id}`);
            setInventory((prev) => prev.filter((item) => item._id !== id));
            toast.success("Item deleted successfully!");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete the item.");
        }
    };

    const handleEditItem = (item) => {
        setNewItem(item);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const [data, setData] = useState([])
    // const username = user.user_name
    const[profiles, setProfiles] = ([])
    const [showUsers, setShowUsers] = useState(false);
    const navigate = useNavigate()
    const handleUsers = () => {
    };

    const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
    const adminId = loggedUser.id
    const adminFname = loggedUser.firstName
    const adminLname = loggedUser.lastName
    const adminEmail = loggedUser.email
    useEffect(() => {
        const fetchAdminData = async () => {
        try {
            if (!adminId) return; // Prevent running if adminId is not available
            console.log(adminId)
    
            const resp = await axios.get(`http://localhost:5000/api/users/single/${adminId}`);
            console.log(resp.data)
            setData(resp.data); // Store data in state
    
            // If you need the token, store it in local storage or state
            const token = resp.data.token;
            if (token) {
            localStorage.setItem("adminToken", token); // Example: Store token
            }
    
        } catch (error) {
            setError(error.message);
            console.error("Error fetching admin:", error.response?.data || error.message);
            toast.warn("Trouble loading details");
        }
        };
    
        fetchAdminData();
    }, [adminId]); // Include `adminId` in dependency array

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
                        <p className="p-2 text-sm font-bold cursor-pointer hover:shadow-black hover:shadow flex gap-1 items-center">
                        <MdOutlineInventory />INVENTORY
                        </p>
                    </Link>
                    <Link to="/login" className="no-underline text-black">
                        <p className="p-3 cursor-pointer font-bold hover:shadow-black hover:shadow">
                            Logout
                        </p>
                    </Link>
                </div>
                
            </div>
            <div className="flex fixed flex-col w-full h-[10vh] bg-white z-50 top-0 left-[20%] mx-auto border-b shadow p-3">
                <div className="relative h-fit w-fit flex items-center m-2">
                <p className="font-indie font-bold">Inventory</p>
                    <div className="fixed flex items-center gap-3 right-5">
                    <IoMdNotifications className="rounded-full border-2 p-2 size-10 text-black"/>
                    <Link to="/adminDash" className="my-auto text-center">
                    <img src={profile} className="mx-auto my-auto border-2 rounded-full size-10" alt="IMAGES" />
                    </Link>
                    <p className="text-xs">{adminFname}&nbsp;{adminLname}</p>
                </div>
                </div>
            </div>
            </div>
            </div>
            <div className="container fixed h-[80%] w-[80%] right-0 mx-auto p-6 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
                <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                        Add Item
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed top-20 flex w-[80%] right-0 h-[80%] items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-md relative">
                            <h2 className="text-lg font-bold mb-4">
                                {editingItem ? "Edit Item" : "Add New Item"}
                            </h2>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newItem.itemName}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, itemName: e.target.value })
                                }
                                className="w-full p-2 border border-gray-400 rounded-lg mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Price"
                                value={newItem.itemPrice}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, itemPrice: e.target.value })
                                }
                                className="w-full p-2 border border-gray-400 rounded-lg mb-2"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newItem.itemQuantity}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, itemQuantity: e.target.value })
                                }
                                className="w-full p-2 border border-gray-400 rounded-lg mb-4"
                            />
                            <select
                                value={newItem.itemCategory}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, itemCategory: e.target.value })
                                }
                                className="w-full p-2 border border-gray-400 rounded-lg mb-4"
                            >
                                <option value="otherItems">Select Category</option>
                                <option value="cleaningItems">Cleaning Items</option>
                                <option value="packagingItems">Packaging Items</option>
                                <option value="equipmentItems">All Equipment</option>
                                <option value="utilitiesItems">Utilities</option>
                                <option value="safetyItems">Safety Items</option>
                            </select>
                            <button
                                onClick={handleAddOrEditItem}
                                className="bg-green-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <table className="w-full bg-white rounded shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Quantity</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(inventory) &&
                            inventory.map((item) => (
                                <tr key={item._id} 
                                    // className={
                                    //     item.itemQuantity <= 5 ? "bg-red-300" : 
                                    //     item.itemQuantity > 5 && item.itemQuantity <= 10 ? "bg-yellow-300" : "bg-green-300"
                                    // }
                                >
                                    <td className="p-4 border text-black border-gray-200">{item.itemName}</td>
                                    <td className="p-4 border text-black border-gray-200">{item.itemPrice}</td>
                                    <td className="p-4 border text-black border-gray-200">
                                    {item.itemQuantity <= 5 ? <div className="flex items-center justify-between">{item.itemQuantity}<p className="bg-red-900 p-1 border text-white text-xs rounded-lg">Low Supply</p></div> : 
                                    item.itemQuantity > 5 && item.itemQuantity <= 10 ? <div className="flex items-center justify-between">{item.itemQuantity}<p className="bg-yellow-500 p-1 border text-black text-xs rounded-lg">Fair Supply</p></div> : <div className="flex items-center justify-between">{item.itemQuantity}<p className="bg-green-900 p-1 border text-white text-xs rounded-lg">Good Supply</p></div>}
                                    </td>
                                    <td className="p-4 border text-black border-gray-200">{item.itemCategory}</td>
                                    <td className="p-4 border text-black border-gray-200">
                                        <button
                                            onClick={() => handleEditItem(item)}
                                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table> 
            </div>
            <ToastContainer/>
        </>
    );
};

export default Inventory;
