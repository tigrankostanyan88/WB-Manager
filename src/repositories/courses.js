const DB = require('../models');
const { Course, File, Module } = DB.models;

module.exports = {
  // Create new course
  create: async (data, transaction) => {
    return Course.create(data, { transaction });
  },

  // Find course by ID
  findById: async (id) => {
    return Course.findByPk(id);
  },

  // Find course by ID with modules and files
  findByIdWithModules: async (id) => {
    return Course.findByPk(id, {
      include: [
        {
          model: Module,
          as: 'modules',
          include: [{ model: File, as: 'files' }]
        },
        {
          model: File,
          as: 'files'
        }
      ]
    });
  },

  // Find all courses with pagination
  findAndCountAll: async ({ limit, offset }) => {
    return Course.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Module,
          as: 'modules',
          include: [{ model: File, as: 'files' }]
        },
        {
          model: File,
          as: 'files'
        }
      ]
    });
  },

  // Update course
  update: async (course, data, transaction) => {
    return course.update(data, { transaction });
  },

  // Delete course
  destroy: async (course, transaction) => {
    return course.destroy({ transaction });
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
  }
};
