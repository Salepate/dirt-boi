import BotClient from "./bot-client"
import BotService from "./bot-service"

export type BotCommand = {
    identifier: string
    invoke: any,
    dontSplit?: boolean
}

export type BotPlugin = {
    name: string
    commands?: BotCommand[]
    services?: BotService[]
    initializationCallback?: (bot: BotClient) => boolean
}

