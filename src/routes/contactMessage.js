// Modules
const router = require('express').Router();

// Controllers
const ctrls = require('../controllers');

router
    .route('/')
    .post(ctrls.contactMessage.createContactMessage)
    .get(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.contactMessage.getContactMessages);

router
    .route('/:id')
    .get(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.contactMessage.getContactMessageById)
    .delete(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.contactMessage.deleteContactMessage);

router
    .route('/:id/read')
    .patch(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.contactMessage.markAsRead);

module.exports = router;
