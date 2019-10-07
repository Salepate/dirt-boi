import { MessageSource, sendMessage } from "../../../bot/message-source";
import {version} from '../../../assets/bot.config.json'
import { BotCommand } from "../../../bot/bot-plugin";
import BotClient from "../../../bot/bot-client";
import { versionEmbed } from "../embeds/version-embeds";
import { isUndefined } from "util";

const versionCommand: BotCommand = {
    identifier: 'version',
    invoke: (bot: BotClient, src: MessageSource.Source, pluginName: string) => {

        if ( pluginName ) {
            const plugin = bot.getPlugin(pluginName)
            if ( isUndefined(plugin)) {
                sendMessage(src.channel, `Unknown plugin ${pluginName}`, {expires: 10})
            } else {
                sendMessage(src.channel, versionEmbed(`${plugin.name} plugin`, plugin.version || "1.0.0"))
            }
        } else {
            sendMessage(src.channel, versionEmbed('Dirt Boi', version, 'dev'))
        }
    }
}
 
export default versionCommand