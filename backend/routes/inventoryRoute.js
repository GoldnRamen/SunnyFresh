const express = require("express");
const { AddToInventory, GetAllInventory, GetSingleInventory, UpdateInventory, DeleteInventory } = require("../controllers/inventoryController");
const router = express.Router();

router.post('/', AddToInventory);
router.get('/', GetAllInventory);
router.get('/single/:id', GetSingleInventory);
router.put('/edit/:id', UpdateInventory);
router.delete('/remove/:id', DeleteInventory);
 


module.exports = router;