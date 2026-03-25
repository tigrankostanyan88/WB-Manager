const contactMessage = require('../services/contactMessage');
const catchAsync = require('../utils/catchAsync');

module.exports = {
    // Create contact message
    createContactMessage: catchAsync(async (req, res, next) => {
        const startTime = Date.now();
        const newMessage = await contactMessage.createContactMessage(req.body);
        
        return res.status(201).json({
            status: 'success',
            data: newMessage,
            timing: Date.now() - startTime
        });
    }),

    // Get all contact messages
    getContactMessages: catchAsync(async (req, res, next) => {
        const startTime = Date.now();
        const messages = await contactMessage.getContactMessages();
        
        return res.status(200).json({
            status: 'success',
            data: messages,
            timing: Date.now() - startTime
        });
    }),

    // Get contact message by id
    getContactMessageById: catchAsync(async (req, res, next) => {
        const startTime = Date.now();
        const message = await contactMessage.getContactMessageById(req.params.id);
        
        return res.status(200).json({
            status: 'success',
            data: message,
            timing: Date.now() - startTime
        });
    }),

    // Mark message as read
    markAsRead: catchAsync(async (req, res, next) => {
        const startTime = Date.now();
        const message = await contactMessage.markAsRead(req.params.id);
        
        return res.status(200).json({
            status: 'success',
            data: message,
            timing: Date.now() - startTime
        });
    }),

    // Delete contact message
    deleteContactMessage: catchAsync(async (req, res, next) => {
        const startTime = Date.now();
        await contactMessage.deleteContactMessage(req.params.id);
        
        return res.status(200).json({
            status: 'success',
            message: 'Contact message deleted successfully',
            timing: Date.now() - startTime
        });
    })
};
