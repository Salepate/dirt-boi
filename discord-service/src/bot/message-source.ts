import { TextChannel, User, Message} from 'discord.js';
import { DirtBoiUserProfile } from "../store/user-store";

export namespace MessageSource {
    export type Source = {
        profile: DirtBoiUserProfile
        channel: TextChannel
        user: User
    }
}

export type MessageOptions = {
    expires?: number
}

export const sendMessage = (channel: TextChannel, content: string, options?: MessageOptions) => {
    options = options || {}
    
    if ( options.expires ) {
        const span = options.expires

        if ( span < 0 ) {
            console.error(`: invalid span ${span}`)
        } else {
            channel.send(content).then(p => {
                (p as Message).delete(span)
            })
        }
    } else {
        channel.send(content)    
    }
}
