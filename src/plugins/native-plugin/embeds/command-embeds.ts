import { RichEmbed } from "discord.js";
import { ScopePermission, Commands } from "../../../bot/bot-commands";
import { BotCommand } from "../../../bot/bot-plugin";

export const commandEmbed = (command: BotCommand, enabled?: boolean) => {
    const permissionLabels: string[] = ['None', 'Everyone','Role','Server Admin', 'Server Owner', 'Bot Owner']
    const idx = Math.trunc(Math.log2(command.permission ? command.permission.scope : ScopePermission.User))
    const label = (idx >= 0 && idx < permissionLabels.length) ? permissionLabels[idx] : 'Unknown'

    let usage: string

    if ( command.usage ) {
        const args: string[] = [...command.usage.args.map(arg => {
            const leftBrace = arg.optional ? '[' : '<'
            const rightBrace = arg.optional ? ']' : '>'
            return `${leftBrace}${arg.expected}${rightBrace}`
        })]

        usage = args.join(' ')
    } else 
    {
        usage = ''
    }

    return new RichEmbed({
        title: `${command.identifier} - (${label})`,
        description: command.description,
        fields: [
            {
                name: 'usage',
                value: `${Commands.getCommandPrefix()}${command.identifier}  ${usage}`
            }, 
            {
                name: 'status',
                value: enabled? 'enabled': 'disabled'
            }
        ]
    })
}