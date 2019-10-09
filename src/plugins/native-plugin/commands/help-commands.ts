import { BotCommand } from "../../../bot/bot-plugin";
import { Commands, CommandAlias } from "../../../bot/bot-commands";
import { sendMessage } from "../../../bot/message-source";
import { commandEmbed } from "../embeds/command-embeds";

const helpCommand: BotCommand = {
    identifier: 'help',
    description: 'display a command information',
    invoke: (bot, src, commandName) => {
        commandName = commandName || 'help'
        const command = Commands.getCommand(commandName)

        if ( command ) {
            sendMessage(src.channel, commandEmbed(command, Commands.getCommandStatus(command.identifier)))
        } else {
            sendMessage(src.channel, `unknown command ${commandName}`)
        }
    }
}

export default helpCommand