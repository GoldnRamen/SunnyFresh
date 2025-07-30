const userModel = require("../models/userModel");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const orderModel = require("../models/orderModel");
const mongoose = require("mongoose");


const registerUser = async (req, res) => {
    try {
        // Add basic validation
        const { email, password, username } = req.body;
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "Email or username already exists"
            });
        }

        // Proceed with registration
        const encrypt_password = await bcryptjs.hash(password, 12);
        const new_user = { 
            ...req.body, 
            password: encrypt_password,
            role: "customer" // Explicitly set role for security
        };
        
        const create_user = new userModel(new_user);
        const resp = await create_user.save();
        
        // Remove sensitive data from response
        const user_data = {
            id: resp._id,
            username: resp.username,
            email: resp.email
        };

        res.status(201).json({
            success: true,
            msg: "Account created successfully. Please login.",
            data: user_data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Registration failed",
            error: error.message
        });
    }
};

const loginUser = async ( req, res) => {

    try {
        const { email, password } = req.body;
        const find_user = await userModel.findOne({ email: email });
       if (!find_user) return res.status(404).send({success: false, msg: "Invalid Credentials"});
       const check_password = await bcryptjs.compare(password, find_user.password);
       if (!check_password) return res.status(401).send({success: false, msg: "Invalid Credentials"});
        const user_data = {
            id: find_user._id, 
            username: find_user.username, 
            email: find_user.email,
            role: find_user.role
        };

        // Update last login
        find_user.lastLogin = new Date();
        await find_user.save();
        // Generate JWT token
        const token = jwt.sign({ 
            user_data: {
                ...user_data,
                role: find_user.role
            }
        }, process.env.SECRET_KEY, {expiresIn: '24h'}); 
            res.status(200).json({
                success: true, 
                msg: "Login Successful", 
                data: user_data,
                token: token 
            });
        
    } catch (error) {
        res.status(500).json({
            success: false, 
            msg: "Login Unsuccessful",
            error: error.message
        })
    }
}

const getCustomerById = async (req, res) => {
    try {
        const customer = await userModel.findById(req.params.id);
        if (!customer) {
            return res.status(404).send({
                success: false,
                msg: "Customer not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Customer retrieved successfully",
            data: customer,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve customer",
            error: error.message,
        });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers = await userModel.find();
        res.status(200).send({
            success: true,
            msg: "Customers retrieved successfully",
            data: customers,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve customers",
            error: error.message,
        });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCustomer) {
            return res.status(404).send({
                success: false,
                msg: "Customer not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Customer updated successfully",
            data: updatedCustomer,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to update customer",
            error: error.message,
        });
    }
};

const deleteCustomer = async (req, res) => {
    try {

        const customerId = req.params.id;

    
        // Convert customerId string to ObjectId
        const customerObjectId = new mongoose.Types.ObjectId(customerId);

        // Delete the customer and their orders in parallel to improve performance
        const [deletedCustomer] = await Promise.all([
        userModel.findByIdAndDelete(customerObjectId),
        orderModel.deleteMany({ userId: customerObjectId }) // Ensure field name matches your schema
        ]);

            // const deletedCustomer = await userModel.findByIdAndDelete(req.params.id);


            if (!deletedCustomer) {
                return res.status(404).send({
                    success: false,
                    msg: "Customer not found",
                });
            }
            res.status(200).send({
                success: true,
                msg: "Customer deleted successfully",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                msg: "Failed to delete customer",
                error: error.message,
            });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        
        // Validate required fields
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if admin already exists with this email or username
        const existingAdmin = await userModel.findOne({
            $or: [{ email }, { username }],
            role: "admin"
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email or username already exists"
            });
        }

        // Create new admin account
        const encrypt_password = await bcryptjs.hash(password, 12);
        const new_admin = {
            ...req.body,
            password: encrypt_password,
            role: "admin"
        };

        const create_admin = new userModel(new_admin);
        const resp = await create_admin.save();

        // Generate token for the new admin
        const admin_data = {
            id: resp._id,
            username: resp.username,
            email: resp.email,
            role: resp.role
        };

        const token = jwt.sign(
            { admin_data },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            data: admin_data,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Admin registration failed",
            error: error.message
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const admin = await userModel.findOne({ 
            email: email,
            role: "admin"  // Explicitly check role
        });

        if (!admin) {
            return res.status(401).json({
                success: false, 
                message: "Invalid credentials"
            });
        }

        const validPassword = await bcryptjs.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false, 
                message: "Invalid credentials"
            });
        }

        const admin_data = {
            id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role
        };

        const token = jwt.sign(
            { admin_data },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: admin_data,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await userModel.find({role: "admin"});
        res.status(200).send({
            success: true,
            msg: "Admins retrieved successfully",
            data: customers,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve admins",
            error: error.message,
        });
    }
};

const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;  // Get ID from request parameters
        if (!id) {
            return res.status(400).json({
                success: false,
                msg: "Admin ID is required",
            });
        }
        const admin_id = await userModel.findById(id);
        if (!admin_id) {
            return res.status(404).send({
                success: false,
                msg: "Admin not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Admin retrieved successfully",
            data: admin_id,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve admin",
            error: error.message,
        });
    }
};

const registerEmployee = async ( req, res) => {

    try {
        const encrypt_password = await bcryptjs.hash(req.body.password, 12);
        const new_employee = { ...req.body, password: encrypt_password, role: "employee" };
        const create_employee = new userModel(new_employee);
        const resp = await create_employee.save();
        const employee_data = {
            id: resp._id,  
            firstName: resp.firstName,
            lastName: resp.lastName,
            username: resp.username,
            email: resp.email,
            gender: resp.gender,
        };
        res.status(200).send({success: true, msg: "Employee account created successfully",data: employee_data})
    } catch (error) {
        res.status(500).send({
            success: false, 
            msg: "Employee registration failed",
            error: error.message
        })
    }
}


const loginEmployee = async ( req, res) => {

    try {
        const { email, password } = req.body;
        const find_employee = await userModel.findOne({ email: email });
       if (!find_employee) return res.status(404).send({success: false, msg: "Invalid Credentials"});
       const check_password = await bcryptjs.compare(password, find_employee.password);
       if (!check_password) return res.status(401).send({success: false, msg: "Invalid Credentials"});
        const employee_data = {
            id: find_employee._id,  
            email: find_employee.email,
            role: find_employee.role,
            firstName: find_employee.firstName,
            lastName: find_employee.lastName,
            username: find_employee.username
        };
        // Generate JWT token for employee
        const token = jwt.sign({ employee_data }, process.env.SECRET_KEY, { expiresIn: '24h' });
        res.status(200).send({success: true, msg: "Employee Login Successful", data: employee_data, token: token})
    } catch (error) {
        res.status(500).send({
            success: false, 
            msg: "Login Unsuccessful",
            error: error.message
        })
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const employees = await userModel.find({role: "employee"});
        res.status(200).send({
            success: true,
            msg: "Employees retrieved successfully",
            data: employees,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve employees",
            error: error.message,
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await userModel.findById(req.params.id);
        if (!employee) {
            return res.status(404).send({
                success: false,
                msg: "Employee not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Employee retrieved successfully",
            data: employee,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve employee",
            error: error.message,
        });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEmployee) {
            return res.status(404).send({
                success: false,
                msg: "Employee not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Employee updated successfully",
            data: updatedEmployee,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to update employee",
            error: error.message,
        });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).send({
                success: false,
                msg: "Employee not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Employee deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: "Failed to delete employee",
            error: error.message,
        });
    }
};

const registerSupplier = async ( req, res) => {

    try {
        const encrypt_password = await bcryptjs.hash(req.body.password, 12);
        const new_supplier = { ...req.body, password: encrypt_password, role: "supplier" };
        const create_supplier = new userModel(new_supplier);
        const resp = await create_supplier.save();
        const supplier_data = {
            id: resp._id,  
            firstName: resp.firstName,
            lastName: resp.lastName,
            username: resp.username,
            email: resp.email,
            gender: resp.gender,
        };
        res.status(200).send({success: true, msg: "Supplier created",data: supplier_data})
    } catch (error) {
        res.status(500).send({
            success: false, 
            msg: "There was an error creating a Supplier",
            error: error.message
        })
    }
}

const loginSupplier = async ( req, res) => {

    try {
        const { email, password } = req.body;
        const find_supplier = await userModel.findOne({ email: email });
       if (!find_supplier) return res.status(404).send({success: false, msg: "Invalid Credentials"});
       const check_password = await bcryptjs.compare(password, find_supplier.password);
       if (!check_password) return res.status(401).send({success: false, msg: "Invalid Credentials"});
        const supplier_data = {
            id: find_supplier._id,  
            email: find_supplier.email,
            role: find_supplier.role,
            firstName: find_supplier.firstName,
            lastName: find_supplier.lastName,
            username: find_supplier.username
        };
        // Generate JWT token for supplier
        const token = jwt.sign({ supplier_data }, process.env.SECRET_KEY, { expiresIn: '24h' });
        res.status(200).send({success: true, msg: "Supplier Login Successful", data: supplier_data, token: token})
    } catch (error) {
        res.status(500).send({
            success: false, 
            msg: "Login Unsuccessful",
            error: error.message
        })
    }
}

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await userModel.find({role: "supplier"});
        res.status(200).send({
            success: true,
            msg: "Suppliers retrieved successfully",
            data: suppliers,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve suppliers",
            error: error.message,
        });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await userModel.findById(req.params.id);
        if (!supplier) {
            return res.status(404).send({
                success: false,
                msg: "Supplier not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Supplier retrieved successfully",
            data: supplier,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve supplier",
            error: error.message,
        });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const updatedSupplier = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedSupplier) {
            return res.status(404).send({
                success: false,
                msg: "Supplier not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Supplier updated successfully",
            data: updatedSupplier,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to update supplier",
            error: error.message,
        });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const deletedSupplier = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).send({
                success: false,
                msg: "Supplier not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Supplier deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: "Failed to delete supplier",
            error: error.message,
        });
    }
};






module.exports = { 
    registerUser,
    loginUser,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer, 
    registerAdmin, 
    loginAdmin,
    getAdminById,
    getAllAdmins, 
    registerEmployee, 
    loginEmployee, 
    getAllEmployees, 
    getEmployeeById, 
    updateEmployee, 
    deleteEmployee, 
    registerSupplier, 
    loginSupplier, 
    updateSupplier, 
    deleteSupplier, 
    getAllSuppliers, 
    getSupplierById};