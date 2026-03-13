const router = require('express').Router();

const ctrls = require('../controllers');

router.post('/', ctrls.auth.isLoggedIn, ctrls.auth.protect, ctrls.auth.restrictTo('student', 'user'), ctrls.review.addReview);

router.get('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.review.getReviews);
router.get('/me', ctrls.auth.protect, ctrls.review.getMyReview);
router.put('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('student', 'user'), ctrls.review.updateReview);
router.delete('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.review.deleteReview);


module.exports = router;
