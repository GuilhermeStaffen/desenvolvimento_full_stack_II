const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/adminDashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/dashboard', authMiddleware, getDashboard);

module.exports = router;
