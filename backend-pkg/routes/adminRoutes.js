// backend-pkg/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Semua rute di sini diproteksi dan hanya untuk admin
router.use(protect, isAdmin);

//user
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);

//laporan
router.get('/reports/performance', adminController.getPerformanceReport);

module.exports = router;