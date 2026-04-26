const DB = require('../models');
const { Instructor, File } = DB.models;

module.exports = {
  // Sync Instructor model
  sync: async () => {
    return Instructor.sync();
  },

  // Find one instructor
  findOne: async ({ includeFiles = false, includeAvatarOnly = false } = {}) => {
    const options = {};
    if (includeFiles) {
      if (includeAvatarOnly) {
        // Only include avatar file for better performance
        options.include = [{
          model: File,
          as: 'files',
          where: { name_used: 'instructor_img' },
          required: false
        }];
      } else {
        options.include = [{ association: 'files' }];
      }
    }
    return Instructor.findOne(options);
  },

  // Find all instructors
  findAll: async ({ includeFiles = false, includeAvatarOnly = false } = {}) => {
    const include = [];
    if (includeFiles) {
      if (includeAvatarOnly) {
        // Only include avatar file for better performance
        include.push({
          model: File,
          as: 'files',
          where: { name_used: 'instructor_img' },
          required: false
        });
      } else {
        include.push({ model: File, as: 'files' });
      }
    }

    return Instructor.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      order: [['id', 'DESC']],
      include
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
