const DB = require('../models');
const { Instructor, File } = DB.models;

module.exports = {
  // Sync Instructor model
  sync: async () => {
    return Instructor.sync();
  },

  // Find one instructor
  findOne: async ({ includeFiles = false } = {}) => {
    const options = {};
    if (includeFiles) {
      options.include = [{ association: 'files' }];
    }
    return Instructor.findOne(options);
  },

  // Find all instructors
  findAll: async ({ includeFiles = false } = {}) => {
    const include = [];
    if (includeFiles) {
      include.push({ model: File, as: 'files' });
    }

    return Instructor.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      order: [['id', 'DESC']],
      include,
      raw: true,
      nest: true
    });
  },

  // Create new instructor
  create: async (data) => {
    return Instructor.create(data);
  },

  // Update instructor
  update: async (instructor, data) => {
    return instructor.update(data);
  },

  // Delete instructor
  destroy: async (instructor) => {
    return instructor.destroy();
  },

  // Create file record
  createFile: async (data) => {
    return File.create(data);
  }
};
