const DB = require('../models');
const { Module, Course, File } = DB.models;

module.exports = {
  // Sync Module model
  sync: async () => {
    return Module.sync({ alter: true });
  },

  // Find module by ID
  findById: async (id) => {
    return Module.findByPk(id);
  },

  // Find module by ID with files
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

  // Find all modules with optional course filter
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

  // Get max order for course
  findMaxOrder: async (courseId, transaction) => {
    return Module.findOne({
      where: { course_id: courseId },
      order: [['order', 'DESC']],
      transaction
    });
  },

  // Create new module
  create: async (data, transaction) => {
    return Module.create(data, { transaction });
  },

  // Update module
  update: async (module, data, transaction) => {
    return module.update(data, { transaction });
  },

  // Delete module
  destroy: async (module, transaction) => {
    return module.destroy({ transaction });
  },

  // Find files by row_id and table_name
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
