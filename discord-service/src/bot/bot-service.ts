import BotClient from "./bot-client";

type BotService = {
    run: (bot: BotClient) => boolean | Promise<boolean>
    service: any
    name: string
}

export default BotService