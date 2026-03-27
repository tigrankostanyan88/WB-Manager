const router = require('express').Router();
const ctrls = require('../controllers');

router.get('/', ctrls.heroContent.get);
router.patch('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.heroContent.upsert);
router.delete('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.heroContent.delete);

module.exports = router;