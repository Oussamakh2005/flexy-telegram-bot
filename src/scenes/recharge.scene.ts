import { Scenes, Markup } from "telegraf";

const phoneRechargeScene = new Scenes.WizardScene<any>('PHONE_RECHARGE_SCENE',
    //step 1 : request phone number
    async (ctx) => {
        ctx.scene.state.data = {}
        await ctx.reply("Enter the phone number");
        return ctx.wizard.next();
    },
    //step2 : verify phone number
    async (ctx) => {
        if(!('text' in ctx.message!)){
            await ctx.reply("Please enter a valid phone number");
            return;
        }
        const phoneNumber = ctx.message.text.trim();
        ///----phone number validation (function not created yet)---///
        ///----we also need to set the plane code to the session---///
        ctx.scene.state.data.phoneNumber = phoneNumber;
        await ctx.reply("Enter the amount to recharge.");
        return ctx.wizard.next()
    },
    //step3 : get and verify the amount
    async  (ctx) => {
        const amount = ctx.message.text;
        ///----amount validation (function not created yet)---///
        ctx.scene.state.data.amount = amount;
        await ctx.reply(`Recharge amount: ${amount} to ${ctx.scene.state.data.phoneNumber},confirm?`,
            Markup.inlineKeyboard([
                Markup.button.callback('Yes', 'CONFIRM_RECHARGE'),
                Markup.button.callback('No','CANCEL_RECHARGE'),
            ]),
        );
        return ctx.wizard.next();
    },
    async (ctx) => {
        let message = "";
        if(ctx.callbackQuery.data === "CONFIRM_RECHARGE"){
            message = "you choose to confirm recharge";
            await ctx.reply("wait...")
        }else{
            message = "you choose to cancel recharge";
            await ctx.reply("Cancle")
        }
        await ctx.answerCbQuery(message);
        return ctx.scene.leave();
    }
);

export default phoneRechargeScene;