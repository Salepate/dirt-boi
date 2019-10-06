import BotClient from "./bot-client";

type BotService = {
    run: (bot: BotClient) => boolean | Promise<boolean>
    stop?: (bot: BotClient) => boolean
    service: any
    name: string
}

export default BotService