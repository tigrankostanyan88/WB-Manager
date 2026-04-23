const DB = require('../models');
const { Op } = DB.Sequelize;
const { User, File } = DB.models;

module.exports = {
  // Basic CRUD
  findAll: async ({ where = {} } = {}) => User.findAll({ where, include: 'files' }),
  
  findAndCountAll: async (options) => User.findAndCountAll(options),
  
  count: async (options) => User.count(options),
  
  findById: async (id) => User.findByPk(id, { include: 'files' }),
  
  findByEmail: async (email) => User.findOne({ where: { email } }),
  
  save: async (user) => user.save(),
  
  // File-related queries
  findAvatarFileForUser: async (userId) => File.findOne({ where: { row_id: userId, name_used: 'user_img' } }),
  
  findAllFilesForUser: async (userId) => File.findAll({ where: { row_id: userId } }),
  
  destroyFileById: async (id) => File.destroy({ where: { id }, individualHooks: true }),
  
  destroyAllFilesForUser: async (userId) => File.destroy({ where: { row_id: userId }, individualHooks: true }),
  
  // Find all users excluding certain roles
  findAllExcludingRoles: async (excludeRoles = []) => {
    const where = { deleted: false };
    if (excludeRoles.length) {
      where.role = { [Op.notIn]: excludeRoles };
    }
    return User.findAll({ where, include: 'files' });
  },
  
  // Find users with pagination, search, and filters
  findPaged: async ({ page = 1, limit = 20, search = '', role = 'all', excludeId = null } = {}) => {
    const offset = (page - 1) * limit;
    const where = { deleted: false };
    
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    if (role !== 'all') {
      where.role = role;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    return User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'isPaid', 'createdAt', 'course_ids']
    });
  },
  
  // Find deleted (suspended) users
  findDeleted: async () => {
    return User.findAll({ 
      where: { deleted: true },
      include: 'files',
      order: [['updatedAt', 'DESC']]
    });
  },
  
  // Restore user (set deleted=false)
  restoreUser: async (id) => {
    return User.update({ deleted: false }, { where: { id } });
  }
};
