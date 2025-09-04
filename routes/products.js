const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, authorizeRoles('admin'), productController.create);
router.get('/', productController.list);
router.get('/:id', productController.getById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), productController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), productController.remove);

module.exports = router;
