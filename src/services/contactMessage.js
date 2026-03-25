const repo = require('../repositories/contactMessage');

module.exports = {
    // Create contact message
    createContactMessage: async (body) => {
        const { name, email, subject, message } = body;
        
        if (!name || !email || !subject || !message) {
            const error = new Error('All fields are required!');
            error.statusCode = 400;
            throw error;
        }

        return await repo.create({
            name,
            email,
            subject,
            message
        });
    },

    // Get all contact messages
    getContactMessages: async () => {
        return await repo.findAll();
    },

    // Get contact message by id
    getContactMessageById: async (id) => {
        const message = await repo.findById(id);
        if (!message) {
            const error = new Error('Contact message not found!');
            error.statusCode = 404;
            throw error;
        }
        return message;
    },

    // Mark message as read
    markAsRead: async (id) => {
        const message = await repo.findById(id);
        if (!message) {
            const error = new Error('Contact message not found!');
            error.statusCode = 404;
            throw error;
        }

        await repo.update(message, { read: true });
        return message;
    },

    // Delete contact message
    deleteContactMessage: async (id) => {
        const message = await repo.findById(id);
        if (!message) {
            const error = new Error('Contact message not found!');
            error.statusCode = 404;
            throw error;
        }

        await repo.destroy(message);
        return message;
    }
};
