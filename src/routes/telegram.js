const router = require('express').Router();
const ctrls = require('../controllers/telegram');

// Public route for Telegram webhook
router.post('/webhook', ctrls.webhook);

module.exports = router;
