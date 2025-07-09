const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/slug/:slug', pageController.getPageBySlug);

module.exports = router;