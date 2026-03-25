const repo = require('../repositories/courseRegistration');

module.exports = {
  // Create new course registration
  createCourseRegistration: async (body) => {
    return repo.create(body);
  },

  // Get all course registrations
  getCourseRegistrations: async () => {
    const registrations = await repo.findAll();
    if (!registrations || registrations.length === 0) {
      const error = new Error('No course registrations found!');
      error.statusCode = 404;
      throw error;
    }
    return registrations;
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
