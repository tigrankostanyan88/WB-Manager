const router = require('express').Router();
const ctrls = require('../controllers');

// Enroll student (admin only)
router.post('/enroll', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.studentCourse.enrollStudent);

// Check access to specific course (student)
router.get('/access/:courseId', ctrls.auth.protect, ctrls.studentCourse.checkAccess);

// Get my courses (student)
router.get('/my-courses', ctrls.auth.protect, ctrls.studentCourse.getMyCourses);

// Get students for a course (admin only)
router.get('/course-students/:courseId', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.studentCourse.getCourseStudents);

// Revoke access (admin only)
router.post('/revoke', ctrls.auth.protect, ctrls.auth.restrictTo('admin'), ctrls.studentCourse.revokeAccess);

module.exports = router;
