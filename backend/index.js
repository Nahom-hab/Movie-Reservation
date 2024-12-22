const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const MovieRoute = require('./routes/movie.route.js');
const SettingRoute = require('./routes/setting.route.js');
const VoteRoute = require('./routes/vote.route.js');
const MessageRoute = require('./routes/sendMessage.route.js');
const initializeBot = require('./config/bot.js');
const TicketRoute = require('./routes/ticket.route.js');
const { Telegraf, Markup } = require('telegraf');
// const bot2 = new Telegraf('8028749136:AAGqwgStkKI8lHfWET_jQoXVb4w3NdiUCmk');za| |
const bot = new Telegraf('7786553835:AAHn3PPyLoyBUOTckFvykwHSDAJn7lf04k0');



// const { StartBot } = require('./config/bot.js');
const conectToDB = require('./config/db.js');
// const { startBot } = require('./utils/bot.js');

const app = express();
dotenv.config();
app.use(cookieParser());

// StartBot();

// Connect to the database
conectToDB();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/movies', MovieRoute);
app.use('/api/setting', SettingRoute);
app.use('/api/vote', VoteRoute);
app.use('/api/ticket', TicketRoute);
app.use('/api/message', MessageRoute);


// initializeBot('7735804190:AAGIUwqLX-hqoya7f9of79BdGaaGt7Nj2i0', '1416986800', '1000434891594');



// bot2.start((ctx) => {
//     const userName = ctx.from.username;
//     const chatId = ctx.chat.id;
//     log

//     // Encode user ID and chat ID in the URL
//     const webAppUrl = `https://4d1b-196-189-233-4.ngrok-free.app?username=${userName}&chatId=${chatId}`;

//     ctx.reply('Welcome! Efrem , Nati or Nahom',
//         Markup.inlineKeyboard([
//             Markup.button.webApp('Admin', webAppUrl)
//         ])
//     );
// });

// bot2.launch();



// bot.start((ctx) => {
//     const userName = ctx.from.username;
//     const chatId = ctx.chat.id;
//     console.log(chatId);

//     // Encode user ID in the userName
//     const webAppUrl = `https://0de7-196-189-233-4.ngrok-free.app?username=${userName}&chatId=${chatId}`;

//     ctx.reply('Welcome! Choose A Movie For Thursday Night.',
//         Markup.inlineKeyboard([
//             Markup.button.webApp('Movie', webAppUrl)
//         ])
//     );
// });

// bot.launch();



// // Serve static files from the frontend
// app.use(express.static(path.join(__dirname, '/frontend/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/frontend/dist/index.html'));
// });

// Global error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
// startBot()

// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
