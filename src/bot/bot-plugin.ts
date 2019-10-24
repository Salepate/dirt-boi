import BotClient from "./bot-client"
import { CommandPermission } from "./bot-commands"
import BotService from "./bot-service"
import { MessageSource } from "./message-source"

export type BotCommand = {
    identifier: string
    invoke: (client: BotClient, source: MessageSource.Source, ...args: any) => boolean | void
    dontSplit?: boolean
    permission?: CommandPermission
    description?: string
    usage?: {
        args: {
            expected: string,
            optional?: boolean
        }[]
    }
}


export type BotPlugin = {
    name: string
    version?: string
    commands?: BotCommand[]
    services?: BotService[]
    initializationCallback?: (bot: BotClient) => boolean
    shutdownCallback?: (bot: BotClient) => any
}

