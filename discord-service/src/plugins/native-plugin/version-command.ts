import { MessageSource } from "../../bot/message-source";
import {version} from '../../assets/bot.config.json'
import { BotCommand } from "../../bot/bot-plugin";
import BotClient from "../../bot/bot-client";

const versionCommand: BotCommand = {
    identifier: 'version',
    invoke: (bot: BotClient, src: MessageSource.Source) => {
        let block = '```'
        MessageSource.sendMessage(src, `${block}Dirt Boi version ${version}${block}`)
    }
}
 
export default versionCommand