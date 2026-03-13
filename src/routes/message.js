const router = require('express').Router();
const ctrls = require('../controllers');

router.use(ctrls.auth.protect);

router.get('/:userId', ctrls.message.getMessages);
router.post('/', ctrls.message.sendMessage);

module.exports = router;
