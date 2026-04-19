// Modules
const router = require('express').Router();

// Controllers
const ctrls = require('../controllers');

router
    .route('/')
    .post(ctrls.courseRegistration.createCourseRegistration)
    .get(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.courseRegistration.getCourseRegistrations);

router
    .route('/:id')
    .get(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.courseRegistration.getCourseRegistrationById)
    .patch(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.courseRegistration.updateCourseRegistration)
    .delete(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.courseRegistration.deleteCourseRegistration);

router
    .route('/:id/viewed')
    .patch(ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.courseRegistration.markAsViewed);

module.exports = router;
