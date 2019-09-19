import * as botConfig from '../assets/bot.config.json'
import { MessageSource } from './message-source.js';
import { isNumber, isNullOrUndefined } from 'util';


export namespace Commands
{
    export interface Command {
        identifier: string
        invoke: any,
        level?: number
        dontSplit?: boolean
        serviceSetup?: any,
    }

    interface CommandList {
        [identifier:string]: Command
    }

    let commands:CommandList = {}

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

    export function registerCommand(command: Command): boolean {
        if ( !commands[command.identifier] ) {
            commands[command.identifier] = command

            if ( !isNullOrUndefined(command.serviceSetup))
                command.serviceSetup()            
            return true
        }
        return false
    }
}
