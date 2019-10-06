import { Message, RichEmbed, TextChannel, User } from 'discord.js';
import { DirtBoiUserProfile } from "../store/user-store";

export namespace MessageSource {
    export type Source = {
        profile: DirtBoiUserProfile
        channel: TextChannel
        user: User
    }
}

export type MessageOptions = {
    expires?: number        // in seconds
    update?: string | RichEmbed
}

export const sendMessage = (source: TextChannel | User, content: string | RichEmbed, options?: MessageOptions) => {
    options = options || {}
    
    if ( options.expires ) {
        const span = options.expires

        if ( span < 0 ) {
            console.error(`: invalid span ${span}`)
        } else {
            const update = options.update || ''

            source.send(content).then(p => {
    
                if ( update !== '') {
                    setTimeout(() => {
                        (p as Message).edit(update)
                    }, span*1000);
                } else {
                    (p as Message).delete(span*1000)
                }
            })
        }
    } else {
        source.send(content)    
    }
}
