import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaBars, FaTimes } from "react-icons/fa";
import logo from "../PNG/household.png"
import central from "../PNG/laundry-room.png"

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showServices, setShowServices] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [signupLogin, setSignupLogin] = useState(false)
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const navigate = useNavigate()
  const [seeGallery, setSeeGallery] = useState(false)
  const opnsRef = useRef(null)

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

  const toggleDiv = () => {
    if (showServices) {
      // Start fade-out animation
      setIsFadingOut(true);
      setTimeout(() => {
        setShowServices(false); // Remove element after fade-out
        setSignupLogin(false); // Remove element after fade-out
        setIsFadingOut(false);
      }, 500); // Adjust this to match the CSS transition duration
    } else {
      setShowServices(true);
    }
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

  const signup = () => {
    navigate("/signup")
  }

  const login = () => {
    navigate("/login");
  };

  return (
    <>
    <div className="relative">
        <nav className="fixed w-full top-0 z-50 bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={toHome}>
                        <img src={logo} alt="Sunny Fresh" className="h-12 w-12" />
                        <span className="font-indie text-2xl text-indigo-600">Sunny Fresh</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition">About</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition">Contact</Link>
                        <button 
                            onClick={toggleDiv}
                            className="text-gray-600 hover:text-indigo-600 transition"
                        >
                            Services
                        </button>
                        <button 
                            onClick={signup}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={toggleMenu}>
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    </div>
    <div className="h-[130vh] flex items-center justify-center p-6 w-full bg-cover bg-no-repeat bg-center relative" style={{backgroundImage: "url('https://cdn.pixabay.com/photo/2020/02/06/02/08/laundromat-4822822_1280.jpg')"}}>
      <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8 w-full">
        {/* Services Popup */}
      {showServices && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${isFadingOut ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleDiv}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Alterations and Repairs</h3>
                      <p className="text-gray-600">Tailoring services for garment adjustments, stitching, and minor repairs.</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Bedding and Linen Cleaning</h3>
                      <p className="text-gray-600">Comprehensive cleaning for bed sheets, duvet covers, pillowcases, and comforters.</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Curtain and Drapery Cleaning</h3>
                      <p className="text-gray-600">Detailed cleaning of your household drapes, curtains and carpets are available</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Dry Cleaning</h3>
                      <p className="text-gray-600">Premium dry-cleaning services for delicate garments.</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Ironing Services</h3>
                      <p className="text-gray-600">Professional ironing for a crisp and polished look.</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Laundry Services</h3>
                      <p className="text-gray-600">Efficient washing, drying, and folding for everyday clothes.</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Stain Removal</h3>
                      <p className="text-gray-600">Expert stain treatment for tough stains on any fabric.</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Leather and Suede Cleaning</h3>
                      <p className="text-gray-600">Specialised care for cleaning and restoring delicate leather and suede garments.</p>
                  </div>
                </div> 
                <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition flex gap-2" onClick={toggleSignup} >
                  {/* <img src={image} className="object-cover w-[50%] h-full rounded-l-lg" alt="IMAGES" /> */}
                  <div className="w-[50% h-full p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Wedding Gown Preservation</h3>
                      <p className="text-gray-600">Special care for cleaning and preserving wedding gowns.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign up/Login Banner */}
      {signupLogin && (
        <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 z-50">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <p className="text-white text-center md:text-left mb-4 md:mb-0">
              Join our community to access exclusive deals and premium services
            </p>
            <div className="flex space-x-4">
              <button onClick={signup} className="bg-white text-indigo-600 px-6 py-2 rounded-full hover:bg-gray-100 transition">
                Sign Up
              </button>
              <button onClick={login} className="border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-indigo-600 transition">
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-6">
          Have questions or need assistance? Reach out to us using the form below or through our contact details.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Contact Details</h2>
            <p className="text-gray-600 mb-4">
              Get in touch with us for inquiries, bookings, or feedback.
            </p>
            <p className="text-gray-700"><strong>📍 Address:</strong> 123 Laundry St, Clean City, CA</p>
            <p className="text-gray-700"><strong>📞 Phone:</strong> (123) 456-7890</p>
            <p className="text-gray-700"><strong>📧 Email:</strong> support@laundryservices.com</p>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;
