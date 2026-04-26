const DB = require('../models');
const { Review, User, File } = DB.models;

module.exports = {
  // Find review by ID - optimized with selective attributes
  findById: async (id) => {
    const review = await Review.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
        include: [{
          model: File,
          as: 'files',
          where: { name_used: 'user_img' },
          required: false,
          attributes: ['id', 'name', 'ext', 'table_name']
        }]
      }]
    });
    return review;
  },

  // Find review by user ID - single query with limited fields
  findByUserId: async (userId) => {
    return Review.findOne({ 
      where: { user_id: userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
        include: [{
          model: File,
          as: 'files',
          where: { name_used: 'user_img' },
          required: false,
          attributes: ['id', 'name', 'ext']
        }]
      }]
    });
  },

  // Find all reviews - optimized with raw query equivalent
  findAll: async () => {
    return Review.findAll({
      order: [['id', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
        include: [{
          model: File,
          as: 'files',
          where: { name_used: 'user_img' },
          required: false,
          attributes: ['id', 'name', 'ext']
        }]
      }]
    });
  },

  // Create new review
  create: async (data) => {
    return Review.create(data);
  },

  // Update review
  update: async (review, data) => {
    return review.update(data);
  },

  // Delete review
  destroy: async (review) => {
    return review.destroy();
  }
};
