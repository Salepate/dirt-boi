import { Commands } from "../../bot/bot-commands";
import { MessageSource } from "../../bot/message-source";

const storyCommand: Commands.Command = {
    identifier: 'story',
    invoke: (src: MessageSource.Source) => {
        MessageSource.sendMessage(src, "[not implemented yet]")
    },
}

export default storyCommand