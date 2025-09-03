const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.create);
router.get('/', productController.list);
router.get('/:id', productController.getById);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
