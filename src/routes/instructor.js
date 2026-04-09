const router = require('express').Router();
const ctrls = require('../controllers');

// List / Get
router.get('/', ctrls.instructor.getInstructor);

// Create (single or multiple as per controller)
router.post('/', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.instructor.addInstructor);

// Update by id (REST)
router.patch('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.instructor.updateInstructor);

// Delete by id
router.delete('/:id', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.instructor.deleteInstructor);

module.exports = router;
