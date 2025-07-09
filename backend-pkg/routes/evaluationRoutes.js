const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/aspects', evaluationController.getEvaluationAspects);
router.post('/', evaluationController.submitEvaluation);
router.get('/my-results', evaluationController.getMyEvaluationResults);
router.get('/results/:resultId/details', evaluationController.getEvaluationDetails);

module.exports = router;