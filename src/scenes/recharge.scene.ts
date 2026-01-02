import { Scenes, Markup } from "telegraf";
import validatePhoneNumber from "../validation/phone.validation";
import getPlan from "../helpers/getPlan";
import amountValidation from "../validation/amount.validation";
import plans from "../resources/plans";
import oneClickDzClient from "../clients/oneClickDz.client";
const phoneRechargeScene = new Scenes.WizardScene<any>('PHONE_RECHARGE_SCENE',
    //step 1 : request phone number
    async (ctx) => {
        ctx.scene.state.data = {}
        await ctx.reply("Enter the phone number");
        return ctx.wizard.next();
    },
    //step2 : verify phone number
    async (ctx) => {
        if (!('text' in ctx.message!)) {
            await ctx.reply("Please enter a valid phone number");
            return;
        }
        const phoneNumber = ctx.message.text.trim();
        //phone number validation
        if (!validatePhoneNumber(phoneNumber)) {
            await ctx.reply("Invalid phone number");
            return;
        }
        //get provider
        const plan = getPlan(phoneNumber);
        //set the plan data to the scene state
        ctx.scene.state.data.plan = plan;
        ctx.scene.state.data.planCode = plans[plan]?.code;
        ctx.scene.state.data.planCost = plans[plan]?.cost;
        ctx.scene.state.data.phoneNumber = phoneNumber;
        await ctx.reply(`Enter the amount to recharge.\nOperator: ${plans[plan]?.operator}\nmin: ${plans[plan]?.min_amount}DZD\nmax: ${plans[plan]?.max_amount}DZD`);
        return ctx.wizard.next()
    },
    //step3 : get and verify the amount
    async (ctx) => {
        const amount = ctx.message.text;
        const plan = plans[ctx.scene.state.data.plan];
        //amount validation
       const validatedAmount = amountValidation(amount, plan?.min_amount as number, plan?.max_amount as number)
        if (!validatedAmount) {
            await ctx.reply("Invalid amount entred");
            return;
        }
        //check balance :
        const balance = await oneClickDzClient.checkBalance();
        if(balance === null){
            await ctx.reply("Something went wrong.");
            return ctx.scene.leave();
        }
        if(balance as number < validatedAmount){
            ctx.reply("You don't have enough balance to recharge this amount.");
            return ctx.scene.leave();
        }
        ctx.scene.state.data.amount = validatedAmount;
        await ctx.reply(`Recharge amount: ${validatedAmount}DZD\nPhone number: ${ctx.scene.state.data.phoneNumber}\nOperator: ${plan?.operator}\nDo you want to confirme?`,
            Markup.inlineKeyboard([
                Markup.button.callback('Yes', 'CONFIRM_RECHARGE'),
                Markup.button.callback('No', 'CANCEL_RECHARGE'),
            ]),
        );
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (ctx.callbackQuery.data === "CONFIRM_RECHARGE") {
            await ctx.answerCbQuery("you choose to confirm recharge");;
            await ctx.reply("wait...")
            //send topup request 
            const response = await oneClickDzClient.sendTopUp(ctx.scene.state.data.planCode, ctx.scene.state.data.phoneNumber, ctx.scene.state.data.amount);
            if (!response) {
                await ctx.reply("Faild to send topup");
                return ctx.scene.leave();
            }
            const topupId = response.topupId;
            await ctx.reply(`Topup request sent with id: ${topupId}\nPlease wait for the status of your recharge.`);
            //start polling
            const pollingResponse = await oneClickDzClient.polling(topupId);
            await ctx.reply(pollingResponse.msg);
        } else {
            await ctx.answerCbQuery("you choose to cancel recharge");
            await ctx.reply("Cancle")
        }
        return ctx.scene.leave();
    }
);

export default phoneRechargeScene;