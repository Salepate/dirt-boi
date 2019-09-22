import { MessageSource, sendMessage } from "../../bot/message-source";
import {version} from '../../assets/bot.config.json'
import { BotCommand } from "../../bot/bot-plugin";
import BotClient from "../../bot/bot-client";

const versionCommand: BotCommand = {
    identifier: 'version',
    invoke: (bot: BotClient, src: MessageSource.Source) => {
        let block = '```'
        sendMessage(src.channel, `${block}Dirt Boi version ${version}${block}`, {expires: 1000*10})
    }
}
 
export default versionCommand