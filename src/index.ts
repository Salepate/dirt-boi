import BotClient from "./bot/bot-client";
import nativePlugin from "./plugins/native-plugin/native-plugin";

const bot = new BotClient(__dirname)

bot.run().then(() => {
    bot.registerPlugin(nativePlugin)
}).catch(() => {console.log(': exiting')})