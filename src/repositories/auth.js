const crypto = require('crypto');
const DB = require('../models');
const { Op } = DB.Sequelize;
const { User } = DB.models;

module.exports = {
  // Find user by ID
  findById: async (id, { includeFiles = false, includeAvatarOnly = false } = {}) => {
    const options = {};
    if (includeFiles) {
      if (includeAvatarOnly) {
        // Only include avatar file for better performance
        options.include = [{
          model: DB.models.File,
          as: 'files',
          where: { name_used: 'user_img' },
          required: false
        }];
      } else {
        options.include = [{ model: DB.models.File, as: 'files' }];
      }
    }
    return User.findByPk(id, options);
  },

  // Find user by email (with avatar)
  findByEmail: async (email) => {
    return User.findOne({
      where: { email },
      include: [{
        model: DB.models.File,
        as: 'files',
        where: { name_used: 'user_img' },
        required: false
      }]
    });
  },

  // Find user by email (simple, no includes)
  findByEmailSimple: async (email) => {
    return User.findOne({ where: { email } });
  },

  // Find user with specific fields
  findByIdWithFields: async (id, attributes) => {
    return User.findByPk(id, { attributes });
  },

  // Create new user
  create: async (userData) => {
    return User.create(userData);
  },

  // Save user changes
  save: async (user, options = {}) => {
    return user.save(options);
  },

  // Update login token
  updateLoginToken: async (user, loginToken) => {
    user.login_token = loginToken;
    return user.save({ validate: false });
  },

  // Find user by reset token (not expired)
  findByResetToken: async (hashedToken) => {
    return User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() }
      }
    });
  },

  // Create password reset token
  createPasswordResetToken: (user) => {
    return user.createPasswordResetToken();
  },

  // Clear reset token fields
  clearResetToken: async (user) => {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    return user.save({ validateBeforeSave: false });
  },

  // Sync User model
  syncModel: async () => {
    return User.sync({ alter: true });
  }
};
