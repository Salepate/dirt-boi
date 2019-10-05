import BotClient from "./bot/bot-client";

let bot = new BotClient(__dirname)

bot.run().catch(() => {console.log(': exiting')})