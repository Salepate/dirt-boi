import { MessageSource } from "../../bot/message-source";
import {version} from '../../assets/bot.config.json'
import { BotCommand } from "../../bot/bot-plugin";

const versionCommand: BotCommand = {
    identifier: 'version',
    invoke: (src: MessageSource.Source) => {
        let block = '```'
        MessageSource.sendMessage(src, `${block}Dirt Boi version ${version}${block}`)
    }
}
 
export default versionCommand