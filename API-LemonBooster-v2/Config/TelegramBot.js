//LIBRARIES
const Telegraf = require('telegraf');
require('dotenv').config({path: '.env'});

//API KEY
const botKey = process.env.TELEGRAM_TOKEN;

//BOT
const bot = new Telegraf(botKey);

bot.start(async (ctx) => {
    ctx.reply(`~ Welcome to LemonBooster BOT ~`);
    setTimeout(() => {
        ctx.reply(`~ Activating Monitoring ~`);
    }, 1000);
    setTimeout(() => {
        ctx.reply(`~ 3 ~`);
    }, 2000);
    setTimeout(() => {
        ctx.reply(`~ 2 ~`);
    }, 3000);
    setTimeout(() => {
        ctx.reply(`~ 1 ~`);
    }, 4000);
    setTimeout(() => {
        ctx.reply(`~ Enjoy! ~`);
    }, 5000);
});

exports.SendMessage = (results) => {
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, results);
}

bot.launch();
