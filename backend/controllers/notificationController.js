const Notification = require('../models/notificationModel');
const Order = require('../models/orderModel');

exports.createNotification = async (req, res) => {
  try {
    const { type, message, orderId, recipientType } = req.body;
    const notification = new Notification({
      type,
      message,
      orderId,
      recipientType
    });
    await notification.save();
    
    // Emit websocket event
    req.app.get('io').emit('newNotification', notification);
    
    res.status(201).json({
      status: 'success',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { recipientType } = req.query;
    const notifications = await Notification.find({
      $or: [
        { recipientType },
        { recipientType: 'all' }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('orderId');
    
    res.status(200).json({
      status: 'success',
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    
    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 