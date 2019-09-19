import { BotUser } from "../store/user-store";
import * as Discord from 'discord.js'
import { checkServerIdentity } from "tls";

export namespace MessageSource {
    export type Source = {
        profile: BotUser
        channel: Discord.TextChannel
        user: Discord.User
    }

    export function reply(src: Source, message: string) {
        return src.channel.send(message)
    }
}