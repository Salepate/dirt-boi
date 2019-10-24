import { RichEmbed, User } from "discord.js";
import { BotCommand } from "../../../bot/bot-plugin";
import { sendMessage } from "../../../bot/message-source";
import userInfoWrapper from "../../../bot/wrappers/userInfo-wrapper";
import { ScopePermission } from "../../../bot/bot-commands";

const userInfoCommand: BotCommand = {
    identifier: 'userinfo',
    description: 'get information on self or on mentionned users',
    invoke: (_, source, user: User) => {
        sendMessage(source.user, userInfoEmbed(user))
    },
    permission: {scope: ScopePermission.GuildAdmin }
}

const userInfoEmbed = (user: User) => {
    const embed = new RichEmbed({
        author: {name: user.username},
        title: 'User Information',
        description: `ID: ${user.id}`,
    })
    return embed
}

export default userInfoWrapper(userInfoCommand, {maxUser: 3, triggerEach: true})