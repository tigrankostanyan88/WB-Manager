const repo = require('../repositories/telegram');

module.exports = {
  // Handle Telegram webhook
  webhook: async (body) => {
    const { message, callback_query } = body;

    if (message) {
      const { from, text } = message;
      const telegramId = from.id.toString();
      const username = from.username || `${from.first_name} ${from.last_name || ''}`.trim();

      // Check if user exists with this Telegram ID
      let user = await repo.findByTelegramId(telegramId);

      if (!user && text && text.startsWith('/start')) {
        // New user registration via Telegram
        return {
          action: 'start',
          telegramId,
          username,
          message: 'Welcome! Please use the website to create an account.'
        };
      }

      if (user) {
        return {
          action: 'existing_user',
          user,
          message: `Hello ${user.name}!`
        };
      }

      return {
        action: 'unknown',
        message: 'Please register on our website first.'
      };
    }

    if (callback_query) {
      // Handle callback queries
      return {
        action: 'callback',
        data: callback_query.data
      };
    }

    return { action: 'noop' };
  }
};
