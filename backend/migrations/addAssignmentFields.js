const mongoose = require('mongoose');
const Order = require('../models/orderModel');
require('dotenv').config();

const migrationScript = async () => {
  try {
    // Connect to MongoDB using the correct env variable
    await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get all existing orders
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders to update`);

    // Update each order with new fields
    const updatePromises = orders.map(order => {
      return Order.findByIdAndUpdate(order._id, {
        $set: {
          assignedTo: null,
          assignedAt: null
        }
      }, { new: true });
    });

    await Promise.all(updatePromises);
    console.log('Successfully updated all orders with new fields');

    // Verify the updates
    const verifyOrders = await Order.find({
      $or: [
        { assignedTo: { $exists: false } },
        { assignedAt: { $exists: false } }
      ]
    });

    if (verifyOrders.length > 0) {
      console.log(`Warning: ${verifyOrders.length} orders still missing new fields`);
    } else {
      console.log('All orders have been successfully migrated');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the migration
migrationScript(); 