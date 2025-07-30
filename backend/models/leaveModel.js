const mongoose = require("mongoose");


const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    leaveStatus: {
        type: String,
        enum: ["pending","rejected", "approved"],
        default: "pending"  
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    leaveType: {
        type: String,
        enum: ["working","sick", "casual", "vacation"],
        default: "working"
    }
}, {timestamps: true});

const leaveModel = mongoose.model('Leave', leaveSchema)
module.exports = leaveModel;