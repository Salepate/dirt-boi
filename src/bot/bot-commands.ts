import * as botConfig from '../assets/bot.config.json'
import BotClient from './bot-client'
import { BotCommand } from './bot-plugin'
import { MessageSource } from './message-source'


export enum ScopePermission {
    None            = 0,
    User            = 1 << 1,
    Role            = 1 << 2, // not implemented yet
    GuildAdmin      = 1 << 3,
    GuildOwner      = 1 << 4,
    BotOwner        = 1 << 5
}

export enum CommandAlias {
    Null            = 0,
    Short           = 1 << 0,
    Long            = 1 << 1,
    OnlyLong        = 1 << 2,
}

export type CommandPermission = {
    scope: ScopePermission
}

export type CommandInstance = {
    readonly permissions: CommandPermission
    invoke: () => any
}

type InternalCommand = BotCommand & {
    state : { enabled: boolean },
    alias: CommandAlias
}

interface CommandMap { [identifier:string] : InternalCommand }
const commands: CommandMap = {}

export namespace Commands
{
    export const getCommandPrefix = () => botConfig.basePrefix
    export const getCommandSeparator = () => botConfig.namespaceSeparator

    export const getCommandStatus = (name: string) => commands[name] && commands[name].state.enabled

    export const setCommandStatus = (name: string, enabled: boolean) => {
        if ( commands[name] )
            commands[name].state.enabled = enabled
    }

    export function getCommands(variant: CommandAlias = CommandAlias.Short | CommandAlias.OnlyLong) {
        let mapCopy: CommandMap = {}
        for(let p in commands) {
            if ( (commands[p].alias & variant) != CommandAlias.Null )
                mapCopy[p] = commands[p]
        }
        return mapCopy
    }

    export function isCommand(message: string): boolean {
        if ( message.length > botConfig.basePrefix.length && message.startsWith(botConfig.basePrefix) ) {
            let identifier = message.split(/ /)[0].substring(1)
            return commands[identifier] && commands[identifier].state.enabled
        }
        return false
    }

    export function createInstance(bot: BotClient, msg: string, src: MessageSource.Source) {

        let regex = /"([^"\n]*)"|([^\s]+)/g
        let match: RegExpExecArray
        const args: string[] = []
        while( (match = regex.exec(msg) as RegExpExecArray ) !== null) {
            args.push(match[0])
        }

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

    export function registerCommand(command: BotCommand, namespace: string) {
        const internalCommand: InternalCommand = {...command, state: {enabled: true}, alias: CommandAlias.Long}
        const {namespaceSeparator} = botConfig

        const identifier = [namespace, namespaceSeparator, command.identifier].join('')
        commands[identifier] = internalCommand
        
        if ( !commands[command.identifier] ) {
            commands[command.identifier] = {...internalCommand, alias: CommandAlias.Short}
        } else {
            commands[identifier].alias = CommandAlias.OnlyLong
            console.warn(`: unable to register alias for command ${command.identifier}`)
        }
    }

    export function removeCommand(identifier: string, namespace: string) {
        const {namespaceSeparator} = botConfig
        const commandLongIdentifier = [namespace, namespaceSeparator, identifier].join('')
        const commandShortIdentifier = identifier

        if ( commands[commandLongIdentifier]) {
            const cmd = commands[commandLongIdentifier]

            if ( cmd.alias === CommandAlias.Long ) {
                delete commands[commandShortIdentifier]
            }

            delete commands[commandLongIdentifier]
        }
    }

    export const getCommand = (identifier: string): BotCommand | undefined => {
        if ( commands[identifier] )
            return commands[identifier]
    }
}
