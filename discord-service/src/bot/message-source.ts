import { TextChannel, User, Message, RichEmbed} from 'discord.js';
import { DirtBoiUserProfile } from "../store/user-store";
import characterApi from '../plugins/rpg-plugin/game/character/character-api';

export namespace MessageSource {
    export type Source = {
        profile: DirtBoiUserProfile
        channel: TextChannel
        user: User
    }
}

export type MessageOptions = {
    expires?: number        // in seconds
}

export const sendMessage = (source: TextChannel | User, content: string | RichEmbed, options?: MessageOptions) => {
    options = options || {}
    
    if ( options.expires ) {
        const span = options.expires

        if ( span < 0 ) {
            console.error(`: invalid span ${span}`)
        } else {
            source.send(content).then(p => {
                (p as Message).delete(span*1000)
            })
        }
    } else {
        source.send(content)    
    }
}
