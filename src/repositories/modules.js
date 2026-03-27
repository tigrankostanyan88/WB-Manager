const DB = require('../models');
const { Module, Course, File } = DB.models;

module.exports = {
  sync: async () => {
    return Module.sync({ alter: true });
  },

  findById: async (id) => {
    return Module.findByPk(id);
  },

  findByIdWithFiles: async (id) => {
    return Module.findByPk(id, {
      include: [{
        model: File,
        as: 'files',
        required: false,
        where: { table_name: 'modules' },
        order: [['sort', 'ASC']]
      }]
    });
  },

  findAll: async ({ courseId } = {}) => {
    const where = {};
    if (courseId) where.course_id = courseId;

    return Module.findAll({
      where,
      order: [['order', 'ASC']],
      include: [{
        model: File,
        as: 'files',
        required: false,
        where: { table_name: 'modules' },
        order: [['sort', 'ASC']]
      }]
    });
  },

  findMaxOrder: async (courseId, transaction) => {
    return Module.findOne({
      where: { course_id: courseId },
      order: [['order', 'DESC']],
      transaction
    });
  },

  create: async (data, transaction) => {
    return Module.create(data, { transaction });
  },

  update: async (module, data, transaction) => {
    return module.update(data, { transaction });
  },

  destroy: async (module, transaction) => {
    return module.destroy({ transaction });
  },

  findFiles: async (rowId, tableName, transaction) => {
    return File.findAll({
      where: { row_id: rowId, table_name: tableName },
      transaction
    });
  },

  // Create file record
  createFile: async (data, transaction) => {
    return File.create(data, { transaction });
  },

  // Destroy file record
  destroyFile: async (file, transaction) => {
    return file.destroy({ transaction });
  },

  // Get max sort value for files
  getMaxFileSort: async (rowId, tableName, transaction) => {
    return File.max('sort', {
      where: { row_id: rowId, table_name: tableName },
      transaction
    });
  },

  // Update file sort order
  updateFileSort: async (fileId, sort, where = {}) => {
    return File.update(
      { sort },
      { where: { id: fileId, ...where } }
    );
  },

  // Find course by ID
  findCourseById: async (id) => {
    return Course.findByPk(id);
  }
};
