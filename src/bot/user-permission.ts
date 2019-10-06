import { TextChannel, User } from "discord.js";
import { isNullOrUndefined } from "util";
import { DirtBoiUserProfile } from "../store/user-store";
import { ScopePermission } from "./bot-commands";

export type UserPermission = {
    scope: ScopePermission
}

export const resolvePermission = (user: User, profile: DirtBoiUserProfile,  channel: TextChannel) => {
    let scope: ScopePermission = ScopePermission.User

    if ( profile.botOwner )
        scope |= ScopePermission.BotOwner

    if ( channel.guild.ownerID == user.id )
        scope |= ScopePermission.GuildOwner

    const userPermissions = channel.memberPermissions(user)
    if ( !isNullOrUndefined(userPermissions)) {
        if ( userPermissions.has('MANAGE_GUILD') ) {
            scope |= ScopePermission.GuildAdmin
        }
    }

    const permission: UserPermission = {
        scope: scope   
    }

    return permission
}