import BotClient from "./bot/bot-client";
import nativePlugin from "./plugins/native-plugin/native-plugin";

const bot = new BotClient(__dirname)

bot.run().then(() => {
    bot.registerPlugin(nativePlugin)
}).catch(() => {console.log(': exiting')})


const shutdownBot = () => {
    console.log(`: bot shutdown`)
    bot.shutdown()
    process.exit(0)
}

// process.on('SIGTERM', shutdownBot)
process.on('SIGINT', shutdownBot)
