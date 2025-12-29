import { Telegraf } from "telegraf";
import { TELEGRAM_BOT_TOKEN } from "./config/env";
import isAdmin from "./middlewares/isAdmin";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(`Hello, ${ctx.from.first_name}!`);
});
export default bot;