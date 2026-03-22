const catchAsync = require('../utils/catchAsync');
const service = require('../services/studentCourse');

module.exports = {
  // Enroll student in course (by admin)
  enrollStudent: catchAsync(async (req, res, next) => {
    const enrollment = await service.enrollStudent(req.body);

    res.status(201).json({
      status: 'success',
      data: enrollment
    });
  }),

  // Check if student has access to course
  checkAccess: catchAsync(async (req, res, next) => {
    const result = await service.checkAccess(req.params.courseId, req.user?.id);

    res.status(200).json({
      status: 'success',
      hasAccess: result.hasAccess,
      enrollment: result.enrollment
    });
  }),

  // Get all courses for current student
  getMyCourses: catchAsync(async (req, res, next) => {
    const result = await service.getMyCourses(req.user?.id);

    res.status(200).json({
      status: 'success',
      count: result.count,
      data: result.enrollments
    });
  }),

  // Get all students for a course (admin only)
  getCourseStudents: catchAsync(async (req, res, next) => {
    const result = await service.getCourseStudents(req.params.courseId);

    res.status(200).json({
      status: 'success',
      count: result.count,
      data: result.enrollments
    });
  }),

  // Get all enrollments (admin only)
  getAllEnrollments: catchAsync(async (req, res, next) => {
    const result = await service.getAllEnrollments();

    res.status(200).json({
      status: 'success',
      count: result.count,
      data: result.enrollments
    });
  }),

  // Revoke access (admin only)
  revokeAccess: catchAsync(async (req, res, next) => {
    await service.revokeAccess(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Մուտքը հետ կանչվեց'
    });
  })
};
