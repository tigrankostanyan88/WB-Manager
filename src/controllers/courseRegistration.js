const catchAsync = require('../utils/catchAsync');
const service = require('../services/courseRegistration');

module.exports = {
  createCourseRegistration: catchAsync(async (req, res, next) => {
    const registration = await service.createCourseRegistration(req.body);

    res.status(201).json({
      status: 'success',
      data: registration,
      time: `${Date.now() - req.time} ms`
    });
  }),

  getCourseRegistrations: catchAsync(async (req, res, next) => {
    const registrations = await service.getCourseRegistrations();

    res.status(200).json({
      status: 'success',
      data: registrations,
      time: `${Date.now() - req.time} ms`
    });
  }),

  getCourseRegistrationById: catchAsync(async (req, res, next) => {
    const registration = await service.getCourseRegistrationById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: registration,
      time: `${Date.now() - req.time} ms`
    });
  }),

  updateCourseRegistration: catchAsync(async (req, res, next) => {
    const registration = await service.updateCourseRegistration(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: registration,
      time: `${Date.now() - req.time} ms`
    });
  }),

  deleteCourseRegistration: catchAsync(async (req, res, next) => {
    await service.deleteCourseRegistration(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Course registration deleted successfully'
    });
  })
};
