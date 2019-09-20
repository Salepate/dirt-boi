import { Commands } from "../../bot/bot-commands";
import { BotCommand } from "../../bot/bot-plugin";
import { MessageSource } from "../../bot/message-source";

let cached: boolean = false
let cacheString: string

const commandsCommand: BotCommand = {
    identifier: 'commands',
    invoke: (src: MessageSource.Source) => {
        let block = '```'

        if ( !cached ) {
            let commands: string[] =[]
    
            for(let p in Commands.getCommands()) {
                commands.push(`!${p}`)
            }
            cacheString = commands.join('\n')
            cached = true
        }

        MessageSource.sendMessage(src, `${block}Command list:\n${cacheString}${block}`)
    }
}
 
export default commandsCommand