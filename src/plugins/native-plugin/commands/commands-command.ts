import { Commands } from "../../../bot/bot-commands";
import { BotCommand } from "../../../bot/bot-plugin";
import { MessageSource, sendMessage } from "../../../bot/message-source";
import BotClient from "../../../bot/bot-client";

import * as botConfig from '../../../assets/bot.config.json'
import { resolvePermission } from "../../../bot/user-permission";

let cached: boolean = false
let commandCache: string

const commandsCommand: BotCommand = {
    identifier: 'commands',
    description: 'display bot command list',
    invoke: (bot: BotClient, src: MessageSource.Source) => {
        let block = '```'

        if ( !cached ) {
            const commands: string[] = []
            const commandMap = Commands.getCommands()
    
            for(let p in Commands.getCommands()) {
                commands.push(`${botConfig.basePrefix}${p} # ${commandMap[p].description}`)
            }
            commandCache = commands.join('\n')
            cached = true
        }

        sendMessage(src.channel, `${block}Command list:\n${commandCache}${block}`, {expires: 10})
    }
}
 
export default commandsCommand