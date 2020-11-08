//LIBRARIES
const Telegraf = require("telegraf");
require("dotenv").config({ path: ".env" });

//API KEY
const botKey = process.env.TELEGRAM_TOKEN || null;

//BOT
if (botKey !== null) {
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
    if(results.length < 4000) {
      bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, results);
    } else {
      bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, results.substring(0,4000));
    }
  };

  bot.launch();
} else {
  exports.SendMessage = (results) => {
    console.log('You need to configure your Telegram Token.');
  };
}
