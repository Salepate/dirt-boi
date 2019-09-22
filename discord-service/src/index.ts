import BotClient from "./bot/bot-client";
import rpgPlugin from "./plugins/rpg-plugin/rpg-plugin";

let bot = new BotClient(__dirname)
bot.run()
bot.registerPlugin(rpgPlugin)