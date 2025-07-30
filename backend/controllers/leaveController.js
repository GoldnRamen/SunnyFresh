const LeaveModel = require("../models/leaveModel");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/userModel");

// Create a new leave request
const createLeaveRequest = async (req, res) => {
    try {
        const { employeeId, leaveType, startDate, endDate } = req.body;

        // Validate required fields
        if (!employeeId || !leaveType || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided.",
            });
        }

        // Validate IDs
        if (!isValidObjectId(employeeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID.",
            });
        }

        // Verify employee exists
        const employee = await userModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        // Validate leave dates
        const leaveStartDate = new Date(startDate);
        const leaveEndDate = new Date(endDate);
        if (leaveStartDate > leaveEndDate) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before end date.",
            });
        }

        // Validate leaveType
        const validLeaveTypes = ["working", "sick", "casual", "vacation"];
        if (!validLeaveTypes.includes(leaveType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave type. Allowed types are 'sick', 'casual', or 'vacation'."
            });  
        }     
        // Create a new leave request
        const leaveRequest = new LeaveModel({
            employeeId,
            startDate,
            leaveType,
            endDate,
        });

        await leaveRequest.save();

        res.status(201).json({
            success: true,
            message: "Leave request created successfully.",
            data: leaveRequest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the leave request.",
            error: error.message
        });
    }
};

// Get all leave requests
const getAllLeaveRequests = async (req, res) => {
    try {
        // Pagination(This code snippet is for demonstration purposes only)
        // const { page = 1, limit = 10 } = req.query;

        // const leaveRequests = await LeaveModel.find()
        //     .populate("employeeId", "firstName lastName email")
        //     .skip((page - 1) * limit)
        //     .limit(Number(limit));
        const leaveRequests = await LeaveModel.find().populate("employeeId", "firstName lastName email");

        res.status(200).json({
            success: true,
            message: "All Leave Requests Gotten Successfully",
            data: leaveRequests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching leave requests.",
            error: error.message
        });
    }
};

// Get leave requests for a specific employee
const getLeaveRequestsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const leaveRequests = await LeaveModel.find({ employeeId }).populate("employeeId", "firstName lastName email");

        if (!leaveRequests || leaveRequests.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No leave requests found for this employee.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Leave for a single employee gotten successfully",
            data: leaveRequests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching leave requests.",
            error: error.message
        });
    }
};

// Update leave request status
const updateLeaveRequestStatus = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { leaveStatus } = req.body;

        // Validate leave status
        if (!["pending", "rejected", "approved"].includes(leaveStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave status. Allowed statuses are 'pending', 'rejected', or 'approved'.",
            });
        }

        const updatedLeave = await LeaveModel.findByIdAndUpdate(
            leaveId,
            { leaveStatus },
            { new: true }
        );

        if (!updatedLeave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Leave request updated successfully.",
            data: updatedLeave,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the leave request.",
            error: error.message
        });
    }
};

// Delete a leave request
const deleteLeaveRequest = async (req, res) => {
    try {
        const { leaveId } = req.params;

        const deletedLeave = await LeaveModel.findByIdAndDelete(leaveId);

        if (!deletedLeave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Leave request deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the leave request.",
            error: error.message
        });
    }
};

module.exports = {
    createLeaveRequest,
    getAllLeaveRequests,
    getLeaveRequestsByEmployee,
    updateLeaveRequestStatus,
    deleteLeaveRequest,
};
