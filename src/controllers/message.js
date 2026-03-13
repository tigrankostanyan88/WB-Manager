const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Message, User } = require('../models').models;
const { Op } = require('sequelize');
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

const sendToTelegram = async (user, text) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) return null;
    
    try {
        const message = `📩 *Նոր հաղորդագրություն*\n\n👤 *Օգտատեր:* ${user.name} (#${user.id})\n📧 *Էլ. հասցե:* ${user.email}\n💬 *Հաղորդագրություն:* ${text}`;
        
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        
        return response.data.result.message_id;
    } catch (err) {
        console.error('Telegram error:', err.response?.data || err.message);
        return null;
    }
};

exports.getMessages = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const otherId = req.params.userId || 1; // Default to admin (id: 1)

    const messages = await Message.findAll({
        where: {
            [Op.or]: [
                { sender_id: userId, receiver_id: otherId },
                { sender_id: otherId, receiver_id: userId }
            ]
        },
        order: [['created_at', 'ASC']],
        include: [
            { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
            { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] }
        ]
    });

    res.status(200).json({
        status: 'success',
        data: messages
    });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!message) {
        return next(new AppError('Հաղորդագրությունը չի կարող դատարկ լինել', 400));
    }

    const newMessage = await Message.create({
        sender_id: senderId,
        receiver_id: receiverId || 1, // Default to admin
        message
    });

    // Send to Telegram if admin is receiver
    if (!receiverId || receiverId == 1) {
        const telegramId = await sendToTelegram(req.user, message);
        if (telegramId) {
            newMessage.telegram_message_id = telegramId;
            await newMessage.save();
        }
    }

    res.status(201).json({
        status: 'success',
        data: newMessage
    });
});
