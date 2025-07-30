import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../PNG/household.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const opnsRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toHome = () => {
    navigate("/services");
  };

  const handleOutClick = (event) => {
    if (opnsRef.current && !opnsRef.current.contains(event.target)) {
      setDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutClick);
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
    };
  }, []);

  const toggleLogout = () => {
    setDropDown((prev) => !prev);
  };

  const loggedUser = JSON.parse(localStorage.getItem("laundry_customer_loggedUser"));
  const username = loggedUser.username;

  return (
    <>
      {/* Modern Navigation Bar */}
      <nav className="fixed w-full top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toHome}>
              <img src={logo} alt="Sunny Fresh" className="h-12 w-12" />
              <span className="font-indie text-2xl text-indigo-600">Sunny Fresh</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/services" className="text-gray-600 hover:text-indigo-600 transition">
                Services
              </Link>
              <button
                onClick={toggleLogout}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
              >
                {username}
              </button>
              {dropDown && (
                <div className="absolute top-20 right-4 w-48 bg-white rounded-lg shadow-lg py-2" ref={opnsRef}>
                  <Link to="/customerDash">
                    <div className="px-4 py-2 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600">
                      Status
                    </div>
                  </Link>
                  <Link to="/updateCustomer">
                    <div className="px-4 py-2 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600">
                      Update Profile
                    </div>
                  </Link>
                  <div
                    className="px-4 py-2 hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={toggleMenu}>
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="bg-white h-full w-64 shadow-lg py-4">
          <div className="px-4 flex justify-end">
            <button onClick={toggleMenu}>
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-3 px-4 mt-8">
            <Link
              to="/services"
              className="py-2 text-gray-600 hover:text-indigo-600"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link
              to="/customerDash"
              className="py-2 text-gray-600 hover:text-indigo-600"
              onClick={toggleMenu}
            >
              Status
            </Link>
            <Link
              to="/updateCustomer"
              className="py-2 text-gray-600 hover:text-indigo-600"
              onClick={toggleMenu}
            >
              Update Profile
            </Link>
            <button
              onClick={() => {
                toggleMenu();
                navigate("/login");
              }}
              className="py-2 text-left text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
