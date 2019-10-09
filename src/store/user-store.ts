import * as Discord from "discord.js"

export const ActionNewUser = "new_user"

export type DirtBoiUserProfile = {
    nick: string
    rank: number
    botOwner?: boolean
}


export type UserStore = {
    [id: string]: DirtBoiUserProfile,
}


export function actionUserInteracted(user: Discord.User) {
    return {
        type: ActionNewUser,
        user: user,
    }
}

export default function userStoreReducer(state: UserStore = {}, action: any)
{
    let user: Discord.User = action.user
    switch(action.type) {
        case ActionNewUser:
            if ( state[user.id]) {
                return state
            }
            return {
                ...state,
                [user.id] : {
                    nick: user.username,
                    rank: 0
                }
            }
    }
    return state
}