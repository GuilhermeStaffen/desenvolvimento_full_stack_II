const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.post('/', authMiddleware, cartController.addItem);
router.delete('/:id', authMiddleware, cartController.removeItem);

module.exports = router;