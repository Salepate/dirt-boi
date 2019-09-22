import BotClient from "./bot-client"
import BotService from "./bot-service"
import { MessageSource } from "./message-source"

export type BotCommand = {
    identifier: string
    invoke: (client: BotClient, source: MessageSource.Source, ...args: any) => boolean | void
    dontSplit?: boolean
    level?: number
}

export type BotPlugin = {
    name: string
    commands?: BotCommand[]
    services?: BotService[]
    initializationCallback?: (bot: BotClient) => boolean
}

