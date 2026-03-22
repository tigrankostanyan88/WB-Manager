const DB = require('../models');
const { StudentCourse, Course, User, Module } = DB.models;

module.exports = {
  // Find enrollment by user and course
  findByUserAndCourse: async (userId, courseId) => {
    return StudentCourse.findOne({ where: { user_id: userId, course_id: courseId } });
  },

  // Find active enrollment by user and course
  findActiveByUserAndCourse: async (userId, courseId) => {
    return StudentCourse.findOne({
      where: { user_id: userId, course_id: courseId, status: 'active' }
    });
  },

  // Find all enrollments for user with course data
  findAllByUser: async (userId) => {
    return StudentCourse.findAll({
      where: { user_id: userId },
      include: [{
        model: Course,
        as: 'course',
        include: [{ model: Module, as: 'modules' }]
      }]
    });
  },

  // Find all enrollments for course with student data
  findAllByCourse: async (courseId) => {
    return StudentCourse.findAll({
      where: { course_id: courseId },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'phone', 'role']
      }]
    });
  },

  // Create new enrollment
  create: async (data) => {
    return StudentCourse.create(data);
  },

  // Update enrollment
  update: async (enrollment, data) => {
    return enrollment.update(data);
  },

  // Find all enrollments with user and course data
  findAll: async () => {
    return StudentCourse.findAll({
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'phone', 'role']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  },

  // Find user by ID
  findUserById: async (id) => {
    return User.findByPk(id);
  },

  // Find course by ID with modules
  findCourseById: async (id) => {
    return Course.findByPk(id, {
      include: [{ model: Module, as: 'modules' }]
    })
  }
};
