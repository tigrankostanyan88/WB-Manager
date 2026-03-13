// Helper function to add imageUrl to course data
const addImageUrl = (courseData) => {
  if (courseData.files && courseData.files.length > 0) {
    const f = courseData.files.find((x) => x.name_used === 'course_img') || courseData.files[0];
    if (f && f.name && f.ext) {
      courseData.imageUrl = `/images/${f.table_name || 'courses'}/large/${f.name}.${f.ext}`;
    }
  }
  return courseData;
};

const catchAsync = require('../utils/catchAsync');
const DB = require('../models');
const service = require('../services/courses');

module.exports = {
  // CREATE
  addCourse: catchAsync(async (req, res, next) => {
    const course = await service.addCourse(req.body, req.files, DB);

    res.status(201).json({
      status: 'success',
      data: course
    });
  }),

  // GET ALL (pagination)
  getCourses: catchAsync(async (req, res, next) => {
    const result = await service.getCourses(req.query);
    
    // Add imageUrl to each course
    const coursesWithImages = result.courses.map(course => {
      const courseData = course.toJSON ? course.toJSON() : course;
      return addImageUrl(courseData);
    });

    res.status(200).json({
      status: 'success',
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: coursesWithImages
    });
  }),

  // GET ONE
  getCourse: catchAsync(async (req, res, next) => {
    const course = await service.getCourse(req.params.id);
    const courseData = course.toJSON ? course.toJSON() : course;
    addImageUrl(courseData);

    res.status(200).json({
      status: 'success',
      data: courseData
    });
  }),

  // UPDATE
  updateCourse: catchAsync(async (req, res, next) => {
    const course = await service.updateCourse(req.params.id, req.body, req.files, DB);
    const courseData = course.toJSON ? course.toJSON() : course;
    addImageUrl(courseData);

    res.status(200).json({
      status: 'success',
      data: courseData
    });
  }),

  // DELETE
  deleteCourse: catchAsync(async (req, res, next) => {
    await service.deleteCourse(req.params.id, DB);

    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  })
};
