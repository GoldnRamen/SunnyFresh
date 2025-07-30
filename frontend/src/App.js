// import logo from './logo.svg';
import './App.css';
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useState } from 'react';
import DataProvider from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoaderProvider } from './context/LoaderContext';

import Login from './pages/Login';
import Signup from './pages/Signup';

// import Comments from './components/Comments';


import Landing from './pages/Landing';
import SingleFeed from './pages/SingleFeed';
import AdminLogin from './pages/AdminLogin';

import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import EmployeeDash from './pages/EmployeeDash';
import AdminDash from './pages/AdminDash';

import CustomerDash from './pages/CustomerDash';
import Employees from './pages/Employees';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import EmployeeLogin from './pages/EmployeeLogin';
import SupplierLogin from './pages/SupplierLogin';
import SupplierDash from './pages/SupplierDash';
import Services from './pages/Services';
import Inventory from './pages/Inventory';
import Inbox from './pages/Inbox';
import EmployeeInbox from './pages/EmployeeInbox';
import SupplierInbox from './pages/SupplierInbox';

import AnimatedText from './components/AnimatedText';
import AllOrders from './components/AllOrders';
import DoneOrders from './components/DoneOrders';
import PendingOrders from './components/PendingOrders';
import ProcessingOrders from './components/ProcessingOrders';
import About from './pages/About';
import AdminPending from './components/AdminPending';
import Requestleave from './pages/Requestleave';
import Leavemanagement from './pages/Leavemanagement';
import UpdateCustomer from './pages/UpdateCustomer';


function App() {
  return (
      <>
      <LoaderProvider>
        <NotificationProvider>
          <DataProvider>
            <Router>
              {/* <Navbar /> */}
              <Routes>
                <Route path="/" element={<Landing/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/animatedText" element={<AnimatedText/>} />
                <Route path="/allOrders" element={<AllOrders/>} />
                <Route path="/doneOrders" element={<DoneOrders/>} />
                <Route path="/processingOrders" element={<ProcessingOrders/>} />
                <Route path="/pendingOrders" element={<PendingOrders/>} />
                <Route path="/adminPending" element={<AdminPending/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/updateCustomer" element={<UpdateCustomer />} />
                <Route path="/singleFeed/:id" element={<SingleFeed />} />

                <Route path="/navbar" element={<Navbar />} />
                <Route path="/adminLogin" element={<AdminLogin />} />
                <Route path="/adminDash" element={<AdminDash />} />
                <Route path="/employeeLogin" element={<EmployeeLogin />} />
                <Route path="/employeeDash" element={<EmployeeDash />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/supplierLogin" element={<SupplierLogin />} />
                <Route path="/supplierDash" element={<SupplierDash />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/requestLeave" element={<Requestleave />} />
                <Route path="/leaveManagement" element={<Leavemanagement />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/employeeInbox" element={<EmployeeInbox />} />
                <Route path="/supplierInbox" element={<SupplierInbox />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/customerDash" element={<CustomerDash />} />
                
              </Routes>  
            </Router>
          </DataProvider>
        </NotificationProvider>
      </LoaderProvider>
    </>
  );
}

export default App;
