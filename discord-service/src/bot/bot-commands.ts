import * as botConfig from '../assets/bot.config.json'
import { MessageSource } from './message-source.js';
import { isNumber, isNullOrUndefined, isUndefined } from 'util';
import BotClient from './bot-client.js';
import { BotCommand } from './bot-plugin.js';


export namespace Commands
{
    interface CommandList {
        [identifier:string]: BotCommand
    }

    let commands:CommandList = {}

    export function setCommandStatus(name: string, enabled: boolean) {
        console.log(`not implemented yet`)
    }

    export function getCommands() { return commands }

    export function isBotCommand(msg: string): boolean {
        return msg.length > 1 && msg[0] === botConfig.basePrefix
    }

    export function isValidBotCommand(msg: string): boolean {
        let identifier = msg.split(/ /)[0].substring(1)
        return commands[identifier] !== undefined
    }

    export function invokeCommand(bot: BotClient, msg: string, src: MessageSource.Source) {
        let args = msg.split(/ /)
        
        let identifier = args[0].substring(1)
        
        let command = commands[identifier]

        if ( !isNumber(command.level) || command.level <= src.profile.rank  )
        {
            args.shift()

            if ( command.dontSplit ) {
                command.invoke(bot, src, msg.substr(identifier.length + 2))
            }
            else {
                command.invoke(bot, src, ...args)
            }
        }
        else {
            console.log(`unauthorized access: ${src.profile.nick} (command:${identifier})`)
        }
    }

    export function registerCommand(bot: BotClient, command: BotCommand): boolean {
        let success: boolean = false
        if ( !commands[command.identifier] ) {
            commands[command.identifier] = command
            success = true
        }
        return success
    }
}
