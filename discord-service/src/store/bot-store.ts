import { combineReducers } from 'redux'
import userStoreReducer from './user-store';


export const storeRoot = combineReducers({
    users: userStoreReducer
})

export type BotStore =  ReturnType<typeof storeRoot>