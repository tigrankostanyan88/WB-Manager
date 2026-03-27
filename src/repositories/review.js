const DB = require('../models');
const { Review, User, File } = DB.models;

module.exports = {
  // Find review by ID
  findById: async (id) => {
    return Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: File,
              as: 'files'
            }
          ]
        }
      ]
    });
  },

  // Find review by user ID
  findByUserId: async (userId) => {
    return Review.findOne({ 
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: File,
              as: 'files'
            }
          ]
        }
      ]
    });
  },

  // Find all reviews
  findAll: async () => {
    return Review.findAll({ 
      order: [['id', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: File,
              as: 'files'
            }
          ]
        }
      ]
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
