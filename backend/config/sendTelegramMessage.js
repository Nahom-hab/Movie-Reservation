const { Telegraf } = require('telegraf');

// Initialize the bot with your bot token
const bot = new Telegraf('8028749136:AAH6og7aTJGQOd7uqyFjdDQfdZwFpzlxLcE');

// Controller function to send the image and text to the Telegram chat
const sendToTelegram = async (text, imageUrl) => {
    try {
        // Send the image with the text as a caption
        if (imageUrl) {
            await bot.telegram.sendPhoto('667605413', imageUrl, { caption: text });
        } else {
            // If no image, just send the text
            await bot.telegram.sendMessage('667605413', text);
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
    }
};

module.exports = { sendToTelegram };
