const express = require("express");
const {
    createLeaveRequest,
    getAllLeaveRequests,
    getLeaveRequestsByEmployee,
    updateLeaveRequestStatus,
    deleteLeaveRequest,
} = require("../controllers/leaveController");

const router = express.Router();

// Leave management routes
router.post("/create", createLeaveRequest);
router.get("/all", getAllLeaveRequests);
router.get("/:employeeId", getLeaveRequestsByEmployee);
router.put("/:leaveId", updateLeaveRequestStatus);
router.delete("/:leaveId", deleteLeaveRequest);

module.exports = router;
