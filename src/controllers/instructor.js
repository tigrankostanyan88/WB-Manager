const catchAsync = require('../utils/catchAsync');
const service = require('../services/instructor');

module.exports = {
  // CREATE
  addInstructor: catchAsync(async (req, res, next) => {
    const result = await service.addInstructor(req.body, req.files, req.time);

    res.status(result.wasCreated ? 201 : 200).json({
      status: result.wasCreated ? 'created' : 'updated',
      instructor: result.instructor,
      time: result.time
    });
  }),

  // GET ALL
  getInstructor: catchAsync(async (req, res, next) => {
    const result = await service.getInstructor(req.time);

    res.status(200).json({
      status: 'success',
      instructors: result.instructors,
      time: result.time
    });
  }),

  // UPDATE
  updateInstructor: catchAsync(async (req, res, next) => {
    const instructor = await service.updateInstructor(req.body, req.files);

    res.status(200).json({
      status: 'success',
      instructor
    });
  }),

  // DELETE
  deleteInstructor: catchAsync(async (req, res, next) => {
    await service.deleteInstructor(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Instructor deleted successfully'
    });
  })
};
