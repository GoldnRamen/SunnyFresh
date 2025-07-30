const mongoose = require("mongoose");


const inventorySchema = new mongoose.Schema({
    // adminId: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     required: true,
    //     ref: "User",
    // },
    itemName: {
        type: String,
        required: true,
    },
    itemQuantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"],
    },
    itemPrice: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
    },
    
    itemImage: {
        type: String,
        default: "default-item-image.jpg",
    },
    itemCategory: {
        type: String,
        enum: ["cleaningItems", "packagingItems", "otherItems", "equipmentItems", "safetyItems", "utilitiesItems"],
        default: "utilitiesItems",
    },
    
}, {timestamps: true});

const inventoryModel = mongoose.model('Inventory', inventorySchema)
module.exports = inventoryModel;