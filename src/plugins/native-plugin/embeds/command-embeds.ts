import { RichEmbed } from "discord.js";
import { ScopePermission, CommandAlias } from "../../../bot/bot-commands";
import { BotCommand } from "../../../bot/bot-plugin";

export const commandEmbed = (command: BotCommand, enabled?: boolean) => {
        const permissionLabels: string[] = ['None', 'Everyone','Role','Server Admin', 'Server Owner', 'Bot Owner']
        const idx = Math.trunc(Math.log2(command.permission ? command.permission.scope : ScopePermission.User))
        const label = (idx >= 0 && idx < permissionLabels.length) ? permissionLabels[idx] : 'Unknown'

    return new RichEmbed({
        title: `${command.identifier} - (${label})`,
        description: command.description,
        fields: [
            {
                name: 'usage',
                value: 'not implemented yet'
            }, 
            {
                name: 'status',
                value: enabled? 'enabled': 'disabled'
            }
        ]
    })
}