const mongoose = require("mongoose");

const postNotifierSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    supplierId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    itemName: {
        type: String,
        required: true,
    },
    itemQuantity: {
        type: Number,
        required: true,
    },
    itemCategory: {
        type: String,
        required: true,
    },
    itemPrice: {
        type: Number,
    },
    content:{
        type: String,
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Completed", "Cancelled", "Verified"],
        default: "Pending",
    },
    
}, {timestamps: true});

const PostNotifierModel = mongoose.model("PostNotifier", postNotifierSchema);
module.exports = PostNotifierModel;