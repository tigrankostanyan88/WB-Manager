// Modules
const router = require('express').Router();

// Controllers
const ctrls = require('../controllers');

router
    .route('/')
    .get(ctrls.settings.getSettings)
    .patch(
        ctrls.auth.protect,
        ctrls.auth.restrictTo('admin'),
        ctrls.settings.updateSettings
    )

module.exports = router;
