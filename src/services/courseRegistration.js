const repo = require('../repositories/courseRegistration');
const AppError = require('../utils/appError');

module.exports = {
  // Create new course registration
  createCourseRegistration: async (body) => {
    // Validation with user-friendly Armenian messages
    if (!body.course_id) {
      throw new AppError('Խնդրում ենք ընտրել դասընթացը', 400);
    }
    if (!body.name || body.name.trim() === '') {
      throw new AppError('Խնդրում ենք մուտքագրել ձեր անունը', 400);
    }
    if (!body.phone || body.phone.trim() === '') {
      throw new AppError('Խնդրում ենք մուտքագրել հեռախոսահամարը', 400);
    }

    return repo.create(body);
  },

  // Get all course registrations
  getCourseRegistrations: async () => {
    const registrations = await repo.findAll();
    return registrations || [];
  },

  // Get single course registration by ID
  getCourseRegistrationById: async (id) => {
    const registration = await repo.findById(id);
    if (!registration) {
      const error = new Error('Course registration not found!');
      error.statusCode = 404;
      throw error;
    }
    return registration;
  },

  // Update course registration
  updateCourseRegistration: async (id, body) => {
    const registration = await repo.findById(id);
    if (!registration) {
      const error = new Error('Course registration not found!');
      error.statusCode = 404;
      throw error;
    }

    for (let key in body) {
      registration[key] = body[key];
    }
    await repo.update(registration, registration.toJSON());
    return registration;
  },

  // Delete course registration
  deleteCourseRegistration: async (id) => {
    const registration = await repo.findById(id);
    if (!registration) {
      const error = new Error('Course registration not found!');
      error.statusCode = 404;
      throw error;
    }
    await repo.destroy(registration);
  }
};
