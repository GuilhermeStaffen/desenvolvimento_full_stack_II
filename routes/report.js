const express = require('express');
const router = express.Router();
const { getSalesData } = require('../controllers/reportController');

router.get('/', getSalesData);

module.exports = router;