
const { Telegraf } = require('telegraf');

function initializeBot(botToken, targetChatId, predefinedAccountNumber) {
    const bot = new Telegraf(botToken);

    // Temporary object to store user data
    const userData = {};
    const money = {
        six: 1000,
        eight: 2000,
        twelve: 2500
    };

    // Conversation flow
    bot.start((ctx) => {
        userData[ctx.chat.id] = { username: ctx.from.username || 'N/A' }; // Initialize user data with username
        ctx.reply("Welcome! Let's gather your information. What is your name?");
    });

    bot.on('text', (ctx) => {
        const chatId = ctx.chat.id;
        const message = ctx.message.text;

        if (!userData[chatId]?.name) {
            userData[chatId].name = message;
            ctx.reply("How old are you?");
        } else if (!userData[chatId]?.age) {
            if (isNaN(message)) {
                ctx.reply("Please provide a valid age.");
            } else {
                userData[chatId].age = message;
                ctx.reply("Please send a photo of the student.");
            }
        } else if (!userData[chatId]?.photo) {
            ctx.reply("Waiting for your photo.");
        } else if (!userData[chatId]?.phone) {
            userData[chatId].phone = message;
            ctx.reply("What is your class?");
        } else if (!userData[chatId]?.class) {
            userData[chatId].class = message;

            // Compile all user data
            const summary = `
Name: ${userData[chatId].name}
Age: ${userData[chatId].age}
Phone Number: ${userData[chatId].phone}
Class: ${userData[chatId].class}
Username: ${userData[chatId].username}`;

            let amount = 0;
            if (userData[chatId].class === '6') {
                amount = money.six;
            } else if (userData[chatId].class === '8') {
                amount = money.eight;
            } else if (userData[chatId].class === '12') {
                amount = money.twelve;
            }

            // Send to target chat
            bot.telegram.sendMessage(
                targetChatId,
                `User Information:\n${summary}`
            );
            ctx.reply(
                `Thank you! Here is the information you provided:\n${summary}\n\nThis is my account number: ${predefinedAccountNumber}.\nPlease send ${amount} ETB to this account number.\n***Send a receipt of your payment***`
            );

            // Prompt for the receipt after sending account details
            ctx.reply("Please send a photo of the payment receipt.");

            // Update the state to expect the payment receipt photo next
            userData[chatId].awaitingReceipt = true;
        } else if (userData[chatId]?.awaitingReceipt) {
            // Handle the payment receipt photo upload
            const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Get the highest resolution photo
            userData[chatId].receiptPhoto = photo.file_id;

            // Send receipt photo to target chat
            bot.telegram.sendPhoto(targetChatId, userData[chatId].receiptPhoto, {
                caption: `Payment receipt from ${userData[chatId].name} (@${userData[chatId].username})`
            });

            ctx.reply(
                `Thank you for the receipt! I will contact you with the info you provided.`
            );

            // Clear user data after the process is complete
            delete userData[chatId];
        }
    });

    // Handle photo uploads
    bot.on('photo', (ctx) => {
        const chatId = ctx.chat.id;

        if (!userData[chatId]?.photo && !userData[chatId]?.awaitingReceipt) {
            // This is the student's photo upload
            const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Get the highest resolution photo
            userData[chatId].photo = photo.file_id;
            ctx.reply("Thank you for the photo! Please provide your phone number.");
        } else if (userData[chatId]?.awaitingReceipt) {
            // This is the payment receipt upload
            const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Get the highest resolution photo
            userData[chatId].receiptPhoto = photo.file_id;

            // Send receipt photo to target chat
            bot.telegram.sendPhoto(targetChatId, userData[chatId].receiptPhoto, {
                caption: `Payment receipt from ${userData[chatId].name} (@${userData[chatId].username})`
            });

            ctx.reply(
                `Thank you for the receipt! I will contact you with the info you provided.`
            );

            // Clear user data after the process is complete
            delete userData[chatId];
        } else {
            ctx.reply("I already received your photo. Please continue with the other questions.");
        }
    });

    // Launch the bot
    bot.launch().then(() => {
        console.log("Bot is running!");
    });

    // Handle graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}



module.exports = initializeBot;
// Example usage
