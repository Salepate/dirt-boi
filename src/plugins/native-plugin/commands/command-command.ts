import { BotCommand } from "../../../bot/bot-plugin";
import { ScopePermission, Commands } from "../../../bot/bot-commands";
import BotClient from "../../../bot/bot-client";
import { MessageSource, sendMessage } from "../../../bot/message-source";
import { isUndefined } from "util";

const identifier = 'command'

const commandCommand: BotCommand = {
    identifier: identifier,
    description: 'enable/disable a specific command',
    invoke: (bot: BotClient, source: MessageSource.Source, commandIdentifier: string, state: string) => {
        state = state || ""
        let activate = (state.toLocaleLowerCase().localeCompare("on") === 0) || state === "1"
        let deactivate = (state.toLocaleLowerCase().localeCompare("off") === 0) || state === "0"
        let command = Commands.getCommand(commandIdentifier)

        if ( isUndefined(command)) {
            sendMessage(source.channel, `Unknown command ${commandIdentifier}`, {expires: 5})
        } else {
            if ( command.identifier == identifier ) {
                sendMessage(source.channel, `Cannot alter ${identifier} command`, {expires: 5})
            } else {
                if ( activate ) {
                    Commands.setCommandStatus(command.identifier, true)
                } else if ( deactivate ) {
                    Commands.setCommandStatus(command.identifier, false)   
                }
                sendMessage(source.channel, `command ${command.identifier}: ${Commands.getCommandStatus(commandIdentifier) ? 'enabled' : 'disabled'}`)
            }
        }
    },

    permission: {
        scope: ScopePermission.BotOwner
    },
    usage: {
        args: [
            {
                expected: "command name"
            }, 
            {
                expected: "on|off"
            }
        ]
    }
}

export default commandCommand