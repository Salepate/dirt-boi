import BotClient from "./bot/bot-client";
import storyCommand from "./commands/story";

let bot = new BotClient(__dirname, 'INSERT_DISCORD_BOT_TOKEN_HERE')

bot.run()
bot.registerCommand(storyCommand)