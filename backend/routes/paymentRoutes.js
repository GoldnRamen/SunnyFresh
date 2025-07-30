const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/webhook', paymentController.handleWebhook);
router.get('/verify/:reference', paymentController.verifyPayment);

module.exports = router; 