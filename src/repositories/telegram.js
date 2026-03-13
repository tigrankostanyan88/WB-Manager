const DB = require('../models');
const { User } = DB.models;

module.exports = {
  // Find user by Telegram ID
  findByTelegramId: async (telegramId) => {
    return User.findOne({ where: { telegramId } });
  },

  // Find user by ID
  findById: async (id) => {
    return User.findByPk(id);
  },

  // Link Telegram to user
  linkTelegram: async (user, telegramId, telegramUsername) => {
    user.telegramId = telegramId;
    user.telegramUsername = telegramUsername;
    return user.save();
  }
};
