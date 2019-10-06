import { isUndefined } from 'util';
import * as botConfig from '../assets/bot.config.json';
import BotClient from './bot-client';
import { BotCommand, CommandState } from './bot-plugin';
import { MessageSource } from './message-source';


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

    export function setCommandStatus(name: string, enabled: boolean) {
        console.log(`not implemented yet`)
    }

    export function getCommands() { return commands }

    export function isBotCommand(msg: string): boolean {
        return msg.length > botConfig.basePrefix.length && msg.startsWith(botConfig.basePrefix)
    }

    export function isValidBotCommand(msg: string): boolean {
        let identifier = msg.split(/ /)[0].substring(1)
        return !isUndefined(commands[identifier]) && commands[identifier].state
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
                command.invoke(bot, src, ...args)
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
                state: true
            }
            success = true
        }
        return success
    }

    export const getCommand = (identifier: string): BotCommand & CommandState | undefined => {
        if ( commands[identifier] )
            return commands[identifier]
    }
}
