import BotClient from "./bot/bot-client";
import rpgPlugin from "./plugins/rpg-plugin/rpg-plugin";

let bot = new BotClient(__dirname, 'INSERT_DISCORD_BOT_TOKEN_HERE')

bot.run()
bot.registerPlugin(rpgPlugin)