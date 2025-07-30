const express = require("express");
const {  AddOrder,GetAllOrders,GetOrderById,UpdateOrder,DeleteOrder, assignOrder, getEmployeeOrders, GetOrdersByCustomerId,GetPendingOrders,MarkOrderAsCompleted, } = require("../controllers/orderController");
const router = express.Router();

router.post('/', AddOrder);
router.get('/all', GetAllOrders);
router.get('/all/pending', GetPendingOrders);
router.get('/all/customerId/:userId', GetOrdersByCustomerId);
router.get('/single/:id', GetOrderById);
router.put('/edit/:id', UpdateOrder);
router.delete('/remove/:id', DeleteOrder);
router.put('/assign/:orderId', assignOrder);
router.get('/employee/:employeeId', getEmployeeOrders);

module.exports = router;