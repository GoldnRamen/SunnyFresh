const express = require("express");
const { registerUser,
    loginUser,
    registerAdmin, 
    loginAdmin, 
    registerEmployee, 
    loginEmployee, 
    registerSupplier, 
    loginSupplier, 
    getAllCustomers, 
    getCustomerById, 
    updateCustomer, 
    deleteCustomer, 
    getAllEmployees, 
    getEmployeeById, 
    updateEmployee, 
    deleteEmployee, 
    getAllSuppliers, 
    getSupplierById, 
    updateSupplier, 
    deleteSupplier, 
    getAllAdmins, 
    getAdminById } = require("../controllers/userController");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");
const userModel = require("../models/userModel");

// Public routes
router.post('/login', loginUser);
router.post('/login/admin', loginAdmin);
router.post('/register', registerUser);  // Only for customers

router.post('/login/employee', loginEmployee);
router.post('/login/supplier', loginSupplier);



// Protected routes - Only admin can access these
router.post('/register/admin', authenticateToken, authorizeRoles("admin"), registerAdmin);

router.post('/register/employee', registerEmployee); //authenticateToken, authorizeRoles("admin"), 

router.post('/register/supplier', registerSupplier); //authenticateToken, authorizeRoles("admin"), 

// Protected routes for specific roles
// router.get('/supplier/dashboard', authenticateToken, authorizeRoles("admin", "supplier"), loginSupplier);
// router.get('/employee/dashboard', authenticateToken, authorizeRoles("admin", "employee"), loginEmployee);

// Add this new route before other routes
router.post('/setup/admin', async (req, res, next) => {
    try {
        // Check if any admin exists
        const adminExists = await userModel.findOne({ role: "admin" });
        if (adminExists) {
            return res.status(403).json({
                success: false,
                message: "Initial admin already exists. Please use regular admin registration."
            });
        }
        next(); // Proceed to registerAdmin if no admin exists
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Setup check failed",
            error: error.message
        });
    }
}, registerAdmin);

// Customer routes(get,put & delete)
router.get('/customer/all', getAllCustomers);
router.get('/customer/single/:id', getCustomerById);
router.put('/customer/edit/:id', updateCustomer);
router.delete('/customer/remove/:id', deleteCustomer);
// router.delete("/customer/remove/:id", async (req, res) => {
    
//   });

// Employee routes(get,put & delete)
router.get('/employee/all', getAllEmployees);
router.get('/employee/single/:id', getEmployeeById);
router.put('/employee/edit/:id', updateEmployee);
router.delete('/employee/remove/:id', deleteEmployee);

// Supplier routes(get,put & delete)
router.get('/supplier/all', getAllSuppliers);
router.get('/supplier/single/:id', getSupplierById);
router.put('/supplier/edit/:id', updateSupplier);
router.delete('/supplier/remove/:id', deleteSupplier);

// Admin routes(get)
router.get('/all', getAllAdmins);
router.get('/single/:id', getAdminById);

module.exports = router;