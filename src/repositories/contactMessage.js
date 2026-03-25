const DB = require('../models');
const { ContactMessage } = DB.models;

module.exports = {
    findAll: async () => {
        return ContactMessage.findAll({
            order: [['createdAt', 'DESC']]
        });
    },

    findById: async (id) => {
        return ContactMessage.findByPk(id);
    },

    create: async (data) => {
        return ContactMessage.create(data);
    },

    update: async (contactMessage, data) => {
        return contactMessage.update(data);
    },

    destroy: async (contactMessage) => {
        return contactMessage.destroy();
    }
};
