const DB = require('../models');
const { Registration } = DB.models;

module.exports = {
  findAll: async () => {
    return Registration.findAll();
  },

  findById: async (id) => {
    return Registration.findByPk(id);
  },

  create: async (data) => {
    return Registration.create(data);
  },

  update: async (registration, data) => {
    return registration.update(data);
  },

  destroy: async (registration) => {
    return registration.destroy();
  }
};
