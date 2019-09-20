import * as botConfig from '../assets/bot.config.json'
import { MessageSource } from './message-source.js';
import { isNumber, isNullOrUndefined, isUndefined } from 'util';
import BotClient from './bot-client.js';


export namespace Commands
{
    export interface Command {
        identifier: string
        invoke: (src: MessageSource.Source, ...args: any) => any,
        level?: number
        dontSplit?: boolean
        serviceSetup?: (bot: BotClient) => boolean,
    }

    interface CommandList {
        [identifier:string]: Command
    }

    let commands:CommandList = {}

    export function getCommands() { return commands }

    export function isBotCommand(msg: string): boolean {
        return msg.length > 1 && msg[0] === botConfig.basePrefix
    }

    export function isValidBotCommand(msg: string): boolean {
        let identifier = msg.split(/ /)[0].substring(1)
        return commands[identifier] !== undefined
    }

    export function invokeCommand(msg: string, src: MessageSource.Source) {
        let args = msg.split(/ /)
        
        let identifier = args[0].substring(1)
        
        let command = commands[identifier]

        if ( !isNumber(command.level) || command.level <= src.profile.rank  )
        {
            args.shift()

            if ( command.dontSplit ) {
                command.invoke(src, msg.substr(identifier.length + 2))
            }
            else {
                command.invoke(src, ...args)
            }
        }
        else {
            console.log(`unauthorized access: ${src.profile.nick} (command:${identifier})`)
        }
    }

    export function registerCommand(bot: BotClient, command: Command): boolean {
        let success: boolean = false
        if ( !commands[command.identifier] ) {
            if ( !isUndefined(command.serviceSetup)) {
                success = command.serviceSetup(bot)            
            }
            else {
                success = true
            }

            if ( success ) {
                commands[command.identifier] = command
            }
        }
        return success
    }
}
