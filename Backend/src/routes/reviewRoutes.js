const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', reviewController.getReviews);
router.post('/', authenticateToken, reviewController.createReview);

module.exports = router;
