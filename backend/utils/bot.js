const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('8028749136:AAGqwgStkKI8lHfWET_jQoXVb4w3NdiUCmk');


bot.start((ctx) => {
    const userName = ctx.from.username;

    // Encode user ID in the userName
    const webAppUrl = `https://mov.tekehabesha.com?username=${userName}`;

    ctx.reply('Welcome! Choose A Movie For Thursday Night.',
        Markup.inlineKeyboard([
            Markup.button.webApp('Movie', webAppUrl)
        ])
    );
});

// Function to launch the bot
const startBot = () => {
    bot.launch();
    console.log('Bot is running...');
};

// Export the functions
module.exports = { startBot };