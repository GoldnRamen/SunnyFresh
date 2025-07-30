const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/orderModel');
const Notification = require('../models/notificationModel');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

exports.handleWebhook = async (req, res) => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).json({ status: 'error', message: 'Invalid signature' });
  }

  const event = req.body;

  // Handle the event
  switch (event.event) {
    case 'charge.success':
      const { reference, metadata } = event.data;
      try {
        // Update order status
        const order = await Order.findByIdAndUpdate(metadata.orderId, {
          paymentStatus: 'paid',
          paymentReference: reference
        });

        // Create notification
        const notification = new Notification({
          type: 'payment',
          message: `Payment received for Order #${metadata.orderId} from ${metadata.customerName}`,
          orderId: metadata.orderId,
          recipientType: 'all'
        });
        await notification.save();
        
        // Emit websocket event
        req.app.get('io').emit('newNotification', notification);
        
      } catch (error) {
        console.error('Error processing payment:', error);
      }
      break;
    default:
      console.log(`Unhandled event type: ${event.event}`);
  }

  res.sendStatus(200);
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    if (response.data.status) {
      const { data } = response.data;
      // Update order status
      await Order.findByIdAndUpdate(data.metadata.orderId, {
        paymentStatus: 'paid',
        paymentReference: reference
      });

      return res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error verifying payment'
    });
  }
}; 