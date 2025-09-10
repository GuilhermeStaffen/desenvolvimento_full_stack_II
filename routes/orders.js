const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, orderController.create);
router.get('/my-orders', authMiddleware, orderController.myOrders);

module.exports = router;