const inventoryModel = require("../models/inventoryModel");


const AddToInventory = async (req, res) => {
    try {
        const createInventory = new inventoryModel(req.body);
        const savedItem = await createInventory.save();
        res.status(201).send({
            success: true,
            msg: "Inventory added successfully",
            data: savedItem,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Unable to add to inventory",
            error: error.message,
        });
    }
};


const GetAllInventory = async (req, res) => {
    try {
        const inventory = await inventoryModel.find();
        res.status(200).send({
            success: true,
            msg: "Inventory retrieved successfully",
            data: inventory,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Unable to retrieve inventory",
            error: error.message,
        });
    }
};


const GetSingleInventory = async (req, res) => {
    try {
        const item = await inventoryModel.findById(req.params.id);
        if (!item) {
            return res.status(404).send({
                success: false,
                msg: "Item not found in inventory",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Single item retrieved successfully",
            data: item,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: "Failed to retrieve item from inventory",
            error: error.message,
        });
    }
};


const UpdateInventory = async (req, res) => {
    try {
        const updatedItem = await inventoryModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );
        if (!updatedItem) {
            return res.status(404).send({
                success: false,
                msg: "Item not found in inventory",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Item updated successfully",
            data: updatedItem,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "Failed to update inventory item",
            error: error.message,
        });
    }
};


const DeleteInventory = async (req, res) => {
    try {
        const deletedItem = await inventoryModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send({
                success: false,
                msg: "Item not found in inventory",
            });
        }
        res.status(200).send({
            success: true,
            msg: "Item deleted from inventory successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: "Failed to delete inventory item",
            error: error.message,
        });
    }
};

module.exports = {
    AddToInventory,
    GetAllInventory,
    GetSingleInventory,
    UpdateInventory,
    DeleteInventory,
};
