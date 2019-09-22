import BotClient from "../../bot/bot-client";
import { BotCommand } from "../../bot/bot-plugin";
import { MessageSource, sendMessage } from "../../bot/message-source";

const storyCommand: BotCommand = {
    identifier: 'story',
    invoke: (bot: BotClient, src: MessageSource.Source) => {
        sendMessage(src.channel, "[not implemented yet]")
    },
}

export default storyCommand