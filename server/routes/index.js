const express = require('express');
const userRoutes = require('./userRoutes');
const salesPackageRoutes = require('./salesPackageRoutes');
const servicePackageRoutes = require('./servicePackageRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

// Set up routes
router.use('/users', userRoutes);
router.use('/sales', salesPackageRoutes);
router.use('/service', servicePackageRoutes);
router.use('/orders', orderRoutes);


module.exports = router;