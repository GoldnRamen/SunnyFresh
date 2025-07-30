const express = require('express');
const router = express.Router();
const { createPostNotifierByAdmin, createPostNotifierBySupplier, getAllPostNotifiers, getPostNotifierById, updatePostNotifier, deletePostNotifier } = require('../controllers/postNotifierController');

router.post('/', createPostNotifierByAdmin);
router.post('/supplier-notification', createPostNotifierBySupplier);
router.get('/', getAllPostNotifiers);
router.get('/:id', getPostNotifierById);
router.put('/:id', updatePostNotifier);
router.delete('/:id', deletePostNotifier);

module.exports = router;
