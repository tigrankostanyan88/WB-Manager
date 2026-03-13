const catchAsync = require('../utils/catchAsync');
const { Message, User } = require('../models').models;

exports.webhook = catchAsync(async (req, res, next) => {
    const { message } = req.body;

    if (!message || !message.text || !message.reply_to_message) {
        return res.status(200).json({ status: 'ok' });
    }

    // Check if the reply is from the admin
    if (String(message.from.id) !== String(process.env.TELEGRAM_ADMIN_CHAT_ID)) {
        return res.status(200).json({ status: 'ignored' });
    }

    // Find the original message in DB by telegram_message_id
    const originalMessage = await Message.findOne({
        where: { telegram_message_id: message.reply_to_message.message_id }
    });

    if (!originalMessage) {
        console.log('Original message not found for Telegram reply:', message.reply_to_message.message_id);
        return res.status(200).json({ status: 'not_found' });
    }

    // Save the admin's reply in the DB
    await Message.create({
        sender_id: 1, // Admin ID
        receiver_id: originalMessage.sender_id,
        message: message.text
    });

    res.status(200).json({ status: 'ok' });
});
