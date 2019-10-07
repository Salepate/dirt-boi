import { isUndefined } from 'util'
import * as botConfig from '../assets/bot.config.json'
import BotClient from './bot-client'
import { BotCommand, CommandState } from './bot-plugin'
import { MessageSource } from './message-source'


export enum ScopePermission {
    None            = 0,
    User            = 1 << 1,
    Role            = 1 << 2, // not implemented yet
    GuildAdmin      = 1 << 3,
    GuildOwner      = 1 << 4,
    BotOwner        = 1 << 5
}

export type CommandPermission = {
    scope: ScopePermission
}

export type CommandInstance = {
    readonly permissions: CommandPermission
    invoke: () => any
}

export namespace Commands
{
    interface CommandList {
        [identifier:string]: BotCommand & CommandState
    }

    let commands:CommandList = {}

    export const getCommandStatus = (name: string) => commands[name] && commands[name].enabled

    export const setCommandStatus = (name: string, enabled: boolean) => {
        if ( commands[name] )
            commands[name].enabled = enabled
    }

    export function getCommands() { return commands }


    export function isCommand(message: string): boolean {
        if ( message.length > botConfig.basePrefix.length && message.startsWith(botConfig.basePrefix) ) {
            let identifier = message.split(/ /)[0].substring(1)
            return !isUndefined(commands[identifier]) && commands[identifier].enabled
        }
        return false
    }

    export function createInstance(bot: BotClient, msg: string, src: MessageSource.Source) {
        let args = msg.split(/ /)
        const prefixLength = botConfig.basePrefix.length
        let identifier = args[0].substring(prefixLength)
        let command = commands[identifier]
        let commandArgs: any[]
        args.shift()

        if ( command.dontSplit ) {
            commandArgs = [msg.substr(identifier.length + prefixLength + 1)]
        }
        else {
            commandArgs = [...args]
        }

        const instance: CommandInstance = {
            invoke: () => {
                command.invoke(bot, src, ...commandArgs)
            },
            permissions: command.permission || {scope:ScopePermission.User}
        }

        return instance
    }

    export function registerCommand(bot: BotClient, command: BotCommand): boolean {
        let success: boolean = false
        if ( !commands[command.identifier] ) {
            commands[command.identifier] = {
                ...command,
                enabled: true
            }
            success = true
        }
        return success
    }

    export const getCommand = (identifier: string): BotCommand | undefined => {
        if ( commands[identifier] )
            return commands[identifier]
    }
}
