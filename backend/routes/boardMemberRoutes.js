// backend/routes/boardMemberRoutes.js
const express = require('express');
const router = express.Router();
const boardMemberController = require('../controllers/boardMemberController');

router.get('/', boardMemberController.getAllBoardMembers);

module.exports = router;