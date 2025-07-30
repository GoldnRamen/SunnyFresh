const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

// Add a new order
const AddOrder = async (req, res) => {
    try {
      console.log("Incoming Order Request:", req.body); // Log request

      const { userId, serviceType, totalCost } = req.body;

      // Validate userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: "Invalid userId format." });
      }

      // Validate at least one service is selected
      if (!serviceType || !Array.isArray(serviceType) || serviceType.length === 0) {
        return res.status(400).json({ success: false, message: "At least one service must be selected." });
      }

      // Convert string values to numbers
      const formattedServiceType = serviceType.map(service => ({
        ...service,
        garments: Number(service.garments) || 0,
        adultGarments: Number(service.adultGarments) || 0,
        kidsGarments: Number(service.kidsGarments) || 0,
        cost: Number(service.cost) || 0
      }));

      // Validate totalCost
      const calculatedTotal = formattedServiceType.reduce((sum, service) => sum + service.cost, 0);
      console.log("Calculated Total Cost:", calculatedTotal, "Received Total Cost:", totalCost);

    //   if (calculatedTotal !== Number(totalCost)) {
    //     return res.status(400).json({ success: false, message: "Total cost mismatch. Please verify the values." });
    //   }

      // Ensure user exists
      const userExists = await userModel.findById(userId);
      if (!userExists) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      // Save order to database
      const newOrder = new orderModel({
        userId,
        serviceType: formattedServiceType,
        totalCost: totalCost,
        orderStatus: "Pending"
      });

      await newOrder.save();

      res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
    } catch (error) {
      console.error("❌ Error creating order:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};


  
  

// Get all orders
const GetAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
          .populate('userId')
          .populate('serviceType')
          .populate('assignedTo', 'firstName lastName email')
          .sort({ createdAt: -1 });

        res.status(200).json({
          status: 200,
          message: "Orders retrieved successfully",
          data: orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
const GetOrderById = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        // const order = await orderModel.findById(req.params.id).populate("customerId", "name email");
        if (!order) {
            return res.status(404).send({
                success: false,
                msg: "Order not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Order retrieved successfully",
            data: order,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve order",
            error: error.message,
        });
    }
};

// Update an order
const UpdateOrder = async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated order
        );
        if (!updatedOrder) {
            return res.status(404).send({
                success: false,
                msg: "Order not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Order updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to update order",
            error: error.message,
        });
    }
};

// Delete an order
const DeleteOrder = async (req, res) => {
    try {
        const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).send({
                success: false,
                msg: "Order not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Order deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: "Failed to delete order",
            error: error.message,
        });
    }
};

// Get orders by customer ID
const GetOrdersByCustomerId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Ensure userId is provided
        if (!userId) {
            return res.status(400).send({
                success: false,
                msg: "User ID is required",
            });
        }

        // Fetch orders for the given userId
        const orders = await orderModel.find().populate("userId", "username firstName lastName");

        if (!orders.length) {
            return res.status(404).send({
                success: false,
                msg: "No orders found for this customer",
            });
        }

        // Format response
        return res.status(200).send({
            success: true,
            msg: "Single order retrieved successfully",
            data: orders.map(order => ({
                id: order._id.toString(),
                customer: order.userId,
                quantity: order.itemQuantity,
                price: order.totalServicePrice,
                orderStatus: order.orderStatus,
                serviceType: order.serviceType,
                totalCost: order.totalCost,
            })),
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).send({
            success: false,
            msg: "Failed to retrieve orders for customer",
            error: error.message,
        });
    }
};


// Get all pending orders
const GetPendingOrders = async (req, res) => {
    try {
        const pendingOrders = await orderModel.find({$or: [{ orderStatus: "Pending" }, { orderStatus: "Processing" }]}).populate("userId", "serviceType orderStatus createdAt");
        res.status(200).send({
            success: true,
            msg: "Pending orders retrieved successfully",
            data: pendingOrders,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to retrieve pending orders",
            error: error.message,
        });
    }
};

// Mark order as completed
const MarkOrderAsCompleted = async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            { orderStatus: "Completed" },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).send({
                success: false,
                msg: "Order not found",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Order marked as completed",
            data: updatedOrder,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to mark order as completed",
            error: error.message,
        });
    }
};

// Assign order to employee
const assignOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { employeeId } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        assignedTo: employeeId,
        assignedAt: new Date(),
        orderStatus: "Processing" // Automatically change status to processing when assigned
      },
      { new: true }
    ).populate('assignedTo');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Order assigned successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders assigned to specific employee
const getEmployeeOrders = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const orders = await orderModel.find({ 
      assignedTo: employeeId,
      orderStatus: { $in: ["Pending", "Processing"] } // Only get active orders
    })
    .populate('userId')
    .populate('serviceType')
    .sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      message: "Orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    AddOrder,
    GetAllOrders,
    GetOrderById,
    UpdateOrder,
    DeleteOrder,
    GetOrdersByCustomerId,
    GetPendingOrders,
    MarkOrderAsCompleted,
    assignOrder,
    getEmployeeOrders,
};
