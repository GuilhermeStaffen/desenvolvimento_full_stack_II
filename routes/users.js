const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

router.post('/', userController.create);
router.get('/', authMiddleware, authorizeRoles('admin'),userController.list);
router.get('/:id', authMiddleware,userController.getById);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), userController.remove);

module.exports = router;