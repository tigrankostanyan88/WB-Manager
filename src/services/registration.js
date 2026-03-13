const repo = require('../repositories/registration');

module.exports = {
  // Create new registration
  createRegistration: async (body) => {
    return repo.create(body);
  },

  // Get all registrations
  getRegistration: async () => {
    const registrations = await repo.findAll();
    if (!registrations || registrations.length === 0) {
      const error = new Error('Registration not found!');
      error.statusCode = 404;
      throw error;
    }
    return registrations;
  },

  // Update registration
  updateRegistration: async (id, body) => {
    const registration = await repo.findById(id);
    if (!registration) {
      const error = new Error('Registration not found!');
      error.statusCode = 404;
      throw error;
    }

    for (let key in body) {
      registration[key] = body[key];
    }
    await repo.update(registration, registration.toJSON());
    return registration;
  },

  // Delete registration
  deleteRegistration: async (id) => {
    const registration = await repo.findById(id);
    if (!registration) {
      const error = new Error('Registration not found!');
      error.statusCode = 404;
      throw error;
    }
    await repo.destroy(registration);
  }
};
