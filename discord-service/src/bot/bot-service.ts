import BotClient from "./bot-client";

type BotService = {
    run: (bot: BotClient) => void
    service: any
    name: string
}

export default BotService