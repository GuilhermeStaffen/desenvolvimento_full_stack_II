const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, authorizeRoles('admin'), supplierController.createSupplier);
router.get('/', authMiddleware, authorizeRoles('admin'), supplierController.getSuppliers);
router.get('/:id', authMiddleware, authorizeRoles('admin'), supplierController.getSupplierById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), supplierController.updateSupplier);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), supplierController.deleteSupplier);

module.exports = router;