import { Scenes, Markup } from "telegraf";
import validatePhoneNumber from "../validation/phone.validation";
import getProvider from "../helpers/getProvider";
import amountValidation from "../validation/amount.validation";

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
        //phone number validation
        if(!validatePhoneNumber(phoneNumber)){
            await ctx.reply("Invalid phone number");
            return;
        }
        //get provider
        const provider = getProvider(phoneNumber);
        ctx.scene.state.data.provider = provider;
        ctx.scene.state.data.phoneNumber = phoneNumber;
        await ctx.reply("Enter the amount to recharge.");
        return ctx.wizard.next()
    },
    //step3 : get and verify the amount
    async  (ctx) => {
        const amount = ctx.message.text;
        //amount validation
        if(!amountValidation(amount)){
            await ctx.reply("Invalid amount entred");
            return;
        }
        ctx.scene.state.data.amount = amount;
        await ctx.reply(`Recharge amount: ${amount}\nPhone number: ${ctx.scene.state.data.phoneNumber}\nProvider: ${ctx.scene.state.data.provider}\nDo you want to confirme?`,
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