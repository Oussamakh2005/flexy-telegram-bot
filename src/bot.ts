import { Telegraf , session } from "telegraf";
import { TELEGRAM_BOT_TOKEN } from "./config/env";
import isAdmin from "./middlewares/isAdmin";
import stage from "./scenes/stage";
import type { MyContext } from "./types/MyContext";


const bot = new Telegraf<MyContext>(TELEGRAM_BOT_TOKEN);
bot.use(session());
bot.use(stage.middleware())
bot.start((ctx) => {
    ctx.reply(`Hello, ${ctx.from.first_name}!`);
});
bot.command('charge', async (ctx) => {
    if (isAdmin(ctx.from.id)) {
        await ctx.scene.enter("PHONE_RECHARGE_SCENE");
    } else {
        ctx.reply("send the mobile number");
    }
});
export default bot;