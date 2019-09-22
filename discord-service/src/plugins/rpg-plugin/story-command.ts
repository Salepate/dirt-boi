import BotClient from "../../bot/bot-client";
import { BotCommand } from "../../bot/bot-plugin";
import { MessageSource } from "../../bot/message-source";

const storyCommand: BotCommand = {
    identifier: 'story',
    invoke: (bot: BotClient, src: MessageSource.Source) => {
        MessageSource.sendMessage(src, "[not implemented yet]")
    },
}

export default storyCommand