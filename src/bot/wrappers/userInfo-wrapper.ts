import { BotCommand } from "../bot-plugin";
import { isSnowflake, getIdFromFlake } from "../helpers/command-helpers";
import { User } from "discord.js";
import { isUndefined } from "util";


// transform first command argument into Discord.User
// if a <@Snowflake> is provided somewhere along the arguments, it replaces the first argument with the given user
// and gets removed from its initial place

export type UserInfoProps = {
    maxUser?: number // defines how many users will be transformed and inserted as the first argument
    triggerEach?: boolean // if provided, will trigger command once per user up to {maxUser} users
}

const userInfoWrapper = (command: BotCommand, props: UserInfoProps): BotCommand => ({
    ...command,
    dontSplit: false, // override dont split
    invoke: (client, source, ...args: string[]) => {
        const users: User[] = []

        const removeIndex: number[] = []

        args.forEach((arg, idx) => {
            if ( isSnowflake(arg) && (users.length === 0 || (props.maxUser && users.length < props.maxUser) ) ) {
                const userid = getIdFromFlake(arg)
                const user = client.getUser(userid)
                if ( !isUndefined(user) ) {
                    removeIndex.push(idx)
                    if ( !users.includes(user))
                        users.push(user)
                }
            }
        })

        removeIndex.forEach(idx => args.splice(idx, 1))

        if ( users.length === 0 ) // no user found pushing caller as default
            users.push(source.user)

        if ( props.triggerEach ) {
            users.forEach(user => {
                if ( command.dontSplit ) {
                    command.invoke(client, source, user, args.join(' '))
                } else {
                    command.invoke(client, source, user, ...args)
                }
            })
        } else {
            let firstArg: User | User[]

            if ( users.length === 1 )
                firstArg = users[0]
            else
                firstArg = users

            if ( command.dontSplit ) {
                command.invoke(client, source, firstArg, args.join(' '))
            } else {
                command.invoke(client, source, firstArg, ...args)
            }
        }
    }
})

export default userInfoWrapper