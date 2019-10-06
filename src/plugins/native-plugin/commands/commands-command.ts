import { Commands } from "../../../bot/bot-commands";
import { BotCommand } from "../../../bot/bot-plugin";
import { MessageSource, sendMessage } from "../../../bot/message-source";
import BotClient from "../../../bot/bot-client";

let cached: boolean = false
let cacheString: string

const commandsCommand: BotCommand = {
    identifier: 'commands',
    invoke: (bot: BotClient, src: MessageSource.Source) => {
        let block = '```'

        if ( !cached ) {
            let commands: string[] =[]
    
            for(let p in Commands.getCommands()) {
                commands.push(`!${p}`)
            }
            cacheString = commands.join('\n')
            cached = true
        }

        sendMessage(src.channel, `${block}Command list:\n${cacheString}${block}`, {expires: 10})
    }
}
 
export default commandsCommand