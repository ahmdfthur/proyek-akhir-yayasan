const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/contact-info', settingsController.getContactSettings);

module.exports = router;