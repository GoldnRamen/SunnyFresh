const PostNotifierModel = require('../models/postNotifierModel');
const postNotifierModel = require('../models/postNotifierModel'); // Ensure the correct path
const mongoose = require('mongoose');

// Create a new post notification
const createPostNotifierByAdmin = async (req, res) => {
  try {
    const { adminId, supplierId, itemName, itemQuantity, itemCategory, content } = req.body;

    // Validation
    if (!adminId || !supplierId || !itemName || !itemQuantity || !content || !itemCategory) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newOrder = new PostNotifierModel({
      adminId,
      supplierId,
      itemName,
      itemQuantity,
      itemCategory,
      content,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, message: "Order successfully placed", data: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const createPostNotifierBySupplier = async (req, res) => {
    try {
      const { adminId, supplierId, itemName, itemQuantity, itemPrice, content } = req.body;
  
      // Validation
      if (!supplierId || !adminId || !itemName || !itemQuantity || !itemPrice || !content) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      const newNotification = new postNotifierModel({
        adminId,
        supplierId,
        itemName,
        itemQuantity,
        itemPrice,
        content,
      });
  
      const savedNotification = await newNotification.save();
      res.status(201).json({ success: true, message: "Successfully Notified", data: savedNotification });
    } catch (error) {
      console.error("Error creating post notifier:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  };
  

// Get all post notifications
const getAllPostNotifiers = async (req, res) => {
  try {
    const notifications = await PostNotifierModel.find()
      .populate('adminId', 'firstName lastName email')  // Populate admin info
      .populate('supplierId', 'firstName lastName email')  // Populate supplier info
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ success: true, message: "Show all successfully Notification", data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getPostNotifierById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID." });
    }

    const notification = await postNotifierModel.findById(id)
      .populate('adminId', 'firstName lastName email')
      .populate('orderStatus')
      .populate('supplierId', 'firstName lastName email');

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.status(200).json({ success: true, message: "Notified By ID successfully", data: notification });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


// Update a post notification
const updatePostNotifier = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID." });
    }

    const updatedNotification = await PostNotifierModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.status(200).json({ success: true, data: updatedNotification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};



// Delete a post notification
const deletePostNotifier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID." });
    }

    const deletedNotification = await postNotifierModel.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  createPostNotifierByAdmin,
  createPostNotifierBySupplier,
  getAllPostNotifiers,
  getPostNotifierById,
  updatePostNotifier,
  deletePostNotifier,
};
