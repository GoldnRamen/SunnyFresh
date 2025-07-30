import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaBars, FaTimes } from "react-icons/fa";
import logo from "../PNG/household.png"
import central from "../PNG/laundry-room.png"
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEmail, MdPayment } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { TbCurrencyNaira } from "react-icons/tb";
import { usePaystackPayment } from 'react-paystack';

const CustomerDash = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showServices, setShowServices] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [signupLogin, setSignupLogin] = useState(false)
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const navigate = useNavigate()

  const loggedUser = JSON.parse(localStorage.getItem("laundry_admin"))
  // const adminId = loggedUser.id;
  const loggedCustomer = JSON.parse(localStorage.getItem("laundry_customer_loggedUser"))
  const customerId = loggedCustomer.id;
  const [orders, setOrders] = useState([])
  const [orderStatus, setOrderStatus] = useState("")
  const [seeOpns, setSeeOpns] = useState(false);
  const [error, setError] = useState("");
  const [updateOrder, setUpdateOrder] = useState(false)
  const [deleteOrder, setDeleteOrder] = useState(false)

  const [seeGallery, setSeeGallery] = useState(false)
  const opnsRef = useRef(null)

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

  const toggleOpns = (orderId) => {
    setSeeOpns((prev) => ({
      ...prev,
      [orderId]: !prev[orderId], // Toggle specific customer's options
    }));
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const initializePayment = usePaystackPayment(paymentConfig);

  useEffect(() => {
    const handleAllOrders = async () => {
      try {
        // if (!adminId) return; // Ensure adminId exists before making the request
  
        // console.log("Admin ID:", adminId);
  
        const resp = await axios.get("http://localhost:5000/api/orders/all");
        if (Array.isArray(resp.data.data)) {
          setOrders(
            resp.data.data.filter(order => 
              order.userId && String(order.userId._id) === String(customerId)
            )
          );
        } else {
          console.error("Unexpected data format:", resp.data);
        }
         console.log(orders, "CustomerId") 
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
  }, []); // Runs whenever adminId changes

  const toggleSignup = () =>{
    setSignupLogin(true)
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toHome = ()=>{
    navigate("/")
  }

    const toggleDrop = () => {
        setIsExpanded1(!isExpanded1);
    };
    const toggleDrop2 = () => {
        setIsExpanded2(!isExpanded2);
    };    

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewHeight = window.innerHeight;

      if (scrollPosition > .01 * viewHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
   
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(()=>{
    const handleOutClick = (event) => {
      if (opnsRef.current && !opnsRef.current.contains(event.target)){
        setShowServices({})
      }
    };
    document.addEventListener("mousedown", handleOutClick)
    return()=>{
      document.removeEventListener("mousedown", handleOutClick)
    }
  },[])

  const sendPaymentNotification = async (orderId, paymentMethod) => {
    try {
      await axios.post('http://localhost:5000/api/notifications/payment', {
        orderId,
        paymentMethod,
        customerId,
        timestamp: new Date(),
        message: `New payment received for Order #${orderId}`
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const onSuccess = async (reference) => {
    console.log('Payment successful!', reference);
    try {
      await axios.put(`http://localhost:5000/api/orders/payment/${currentOrder._id}`, {
        paymentStatus: 'paid',
        paymentReference: reference.reference
      });

      // Create notification
      await axios.post('http://localhost:5000/api/notifications', {
        type: 'payment',
        message: `Payment received for Order #${currentOrder._id}`,
        orderId: currentOrder._id,
        recipientType: 'all'
      });

      toast.success('Payment successful!');
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Error processing payment');
    }
  };

  const onClose = () => {
    toast.info('Payment cancelled');
    setShowPaymentModal(false);
  };

  const handlePaymentSelection = (order) => {
    const config = {
      reference: (new Date()).getTime().toString(),
      email: order.userId.email,
      amount: order.totalCost * 100, // Convert to kobo
      publicKey: 'pk_test_615d2f8cd2d9cd9dc2b20ffd5d85909c1e7afd15',
      metadata: {
        orderId: order._id,
        customerName: order.userId.username,
        orderDetails: order.serviceType.map(s => s.category).join(', ')
      }
    };

    setPaymentConfig(config);
    setCurrentOrder(order);
    setShowPaymentModal(true);
  };

  const handlePaymentMethod = async (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'paystack') {
      initializePayment(onSuccess, onClose);
    } else if (method === 'delivery') {
      try {
        await axios.put(`http://localhost:5000/api/orders/payment/${currentOrder._id}`, {
          paymentStatus: 'pending',
          paymentMethod: 'delivery'
        });

        // Create notification
        await axios.post('http://localhost:5000/api/notifications', {
          type: 'payment',
          message: `Pay on delivery selected for Order #${currentOrder._id}`,
          orderId: currentOrder._id,
          recipientType: 'all'
        });

        toast.success('Pay on delivery selected');
        setShowPaymentModal(false);
      } catch (error) {
        console.error('Error updating payment status:', error);
        toast.error('Error processing payment method');
      }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="h-[130vh] flex items-center justify-center p-6 w-full bg-cover bg-no-repeat bg-center relative" style={{backgroundImage: "url('https://cdn.pixabay.com/photo/2020/02/06/02/08/laundromat-4822822_1280.jpg')"}}>
      <div className="w-fit bg-white shadow-lg rounded-lg p-8">       
      <div className="grid grid-cols-3 p-2 gap-2 h-[90%] overflow-y-scroll mx-auto">
      {orders && orders.length > 0 ? (
          [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort in descending order
            .map((order) => (
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
                    {/* Additional UI elements can be added here */}
                  </div>

                  <div className="text-black">
                    <p className="mb-2 font-semibold">Contact Info:</p>
                    <p className="text-sm flex items-center gap-3">Username: {order.userId.username}</p>
                    <p className="flex items-center gap-3"><MdEmail />{order.userId.email}</p>
                    <p className="flex items-center gap-3"><BiPhone />{order.userId.phone}</p>
                  </div>
                </div>

                <div className="p-2 mt-4 rounded-lg bg-gray-300 font-semibold">
                  <div className="flex justify-between gap-4 items-center text-gray-600">
                    <p className="text-sm">Service Type(s)</p>
                    <p className="text-sm">Order Date</p>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <div className="text-sm">
                      {order.serviceType.map((category, index) => (
                        <p key={index}>{category.category}</p>
                      ))}
                    </div>
                    <p className="text-sm">{order.createdAt.split("T")[0]}</p>
                  </div>
                </div>
                {order.orderStatus === "Completed" ? (
                  <div 
                    className="cursor-pointer flex border my-2 animate-pulse rounded hover:bg-green-700 hover:text-white hover:animate-none p-1 justify-between items-center"
                    onClick={() => handlePaymentSelection(order)}
                  >
                    Proceed to Payment<MdPayment className="text-green-700 hover:text-white" />
                  </div>
                ) : null}
              </div>
            ))
        ) : (
          "No Orders Found"
        )}

        </div>
      </div>
    </div>
    {showPaymentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="delivery"
                onChange={() => handlePaymentMethod('delivery')}
              />
              <span>Pay on Delivery</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="paystack"
                onChange={() => handlePaymentMethod('paystack')}
              />
              <span>Pay with Paystack</span>
            </label>
          </div>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default CustomerDash;
