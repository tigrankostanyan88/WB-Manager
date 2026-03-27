const DB = require('../models');

const { HeroContent, File } = DB.models;

module.exports = {
  sync: async () => {
    return HeroContent.sync({ alter: true });
  },

  findOne: async ({ includeFiles = false } = {}) => {
    const include = [];
    if (includeFiles) {
      include.push({
        model: File,
        as: 'file',
        required: false,
        where: { table_name: 'hero_content' }
      });
    }
    return HeroContent.findOne({ include });
  },

  create: async (data, transaction) => {
    return HeroContent.create(data, { transaction });
  },

  update: async (content, data, transaction) => {
    return content.update(data, { transaction });
  },

  destroy: async (content, transaction) => {
    return content.destroy({ transaction });
  },

  findFile: async (rowId, tableName, transaction) => {
    return File.findOne({
      where: { row_id: rowId, table_name: tableName },
      transaction
    });
  },

  createFile: async (data, transaction) => {
    return File.create(data, { transaction });
  },

  destroyFile: async (file, transaction) => {
    return file.destroy({ transaction });
  }
};
