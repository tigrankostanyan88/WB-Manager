const DB = require('../models');
const { File } = DB.models;

module.exports = {
  findAll: async (filters = {}) => {
    const where = {};
    if (filters.table_name) where.table_name = filters.table_name;
    if (filters.row_id) where.row_id = filters.row_id;
    if (filters.name_used) where.name_used = filters.name_used;

    const items = await File.findAll({
      where,
      order: [['sort', 'ASC'], ['date', 'DESC']]
    });
    return items.map(i => i.get({ plain: true }));
  },

  findById: async (id) => File.findByPk(id),

  update: async (id, body) => {
    const file = await File.findByPk(id);
    if (!file) return null;
    await file.update(body);
    return file;
  },

  destroy: async (file) => {
    return file.destroy();
  }
};
