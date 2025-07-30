const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceType: [
    {
      category: {
        type: String,
        enum: ["Stain Removal", "Dry Cleaning", "Ironing", "Laundry"],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      garments: {
        type: Number,
        default: 0, // For Stain Removal
      },
      adultGarments: {
        type: Number,
        default: 0, // For Dry Cleaning, Ironing, Laundry
      },
      kidsGarments: {
        type: Number,
        default: 0, // For Dry Cleaning, Ironing, Laundry
      },
      adultsPickupOption: {
        type: String,
        default: "",
      },
      kidsPickupOption: {
        type: String,
        default: "",
      },
      pickupOption: {
        type: String,
        default: "", // Used for Stain Removal
      },
      cost: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalCost: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Cancelled"],
    default: "Pending",
  },
  /////////////////////////////////////////
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentReference: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  //////////////////////////////////////////
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Order", OrderSchema);
