import { BotCommand } from "../../../bot/bot-plugin";
import { ScopePermission, Commands } from "../../../bot/bot-commands";
import BotClient from "../../../bot/bot-client";
import { MessageSource, sendMessage } from "../../../bot/message-source";
import { isUndefined } from "util";

const identifier = 'command'

const commandCommand: BotCommand = {
    identifier: identifier,
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
                    command.state = true
                } else if ( deactivate ) {
                    command.state = false    
                }
                sendMessage(source.channel, `command ${command.identifier} is ${command.state ? 'enabled' : 'disabled'}`)
            }
        }
    },

    permission: {
        scope: ScopePermission.BotOwner
    }
}

export default commandCommand