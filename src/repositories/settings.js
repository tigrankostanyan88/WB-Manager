const DB = require('../models');
const { Settings, File } = DB.models;

module.exports = {
  // Sync Settings model
  sync: async () => {
    return Settings.sync({ alter: true });
  },

  // Find settings (singleton)
  findOne: async ({ includeFiles = false } = {}) => {
    const options = {};
    if (includeFiles) {
      options.include = [{ association: 'files' }];
    }
    return Settings.findOne(options);
  },

  // Create settings
  create: async (data) => {
    return Settings.create(data);
  },

  // Update settings
  update: async (settings, data) => {
    return settings.update(data);
  },

  // Create file record
  createFile: async (data) => {
    return File.create(data);
  }
};
