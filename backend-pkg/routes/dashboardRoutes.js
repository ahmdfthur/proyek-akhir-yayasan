// backend-pkg/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Semua rute dashboard diproteksi
router.use(protect);

router.get('/teacher-summary', dashboardController.getTeacherSummary);
router.get('/headmaster-summary', dashboardController.getHeadmasterSummary);

module.exports = router;