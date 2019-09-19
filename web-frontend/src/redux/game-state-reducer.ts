import { AnyAction, Action } from "redux";
import { GameCharacter, GameCharacterExperience } from "../rpg/character/game-character";
import { createReducerMap } from "./game-reducer";
import RPG from "../rpg/database";

const STATE_CHAR_UPDATE = 'state_char_update'
const STATE_INCREASE_EXP = 'state_char_exp'

export type GameState = {
    gameCharacter: GameCharacter
    progression: GameCharacterExperience
}

export const actionUpdateGameCharacter = (gameChar: GameCharacter): AnyAction => {
    return {
        type: STATE_CHAR_UPDATE,
        gameCharacter: gameChar
    }
}

export const actionIncreaseExperience = (exp: number): AnyAction => {
    return {
        type: STATE_INCREASE_EXP,
        value: exp
    }
}


const initialState: GameState = {
    gameCharacter: RPG.heroes['default'],
    progression: {
        experience: 0
    }
}


const updateCharReducer = (state: GameState, action: AnyAction): GameState => {
    return {
        ...state,
        gameCharacter: action.gameCharacter
    }
}

const increaseExpReducer = (state: GameState, action: AnyAction): GameState => {
    return {
        ...state,
        progression: {
            ...state.progression,
            experience: state.progression.experience + action.value
        }
    }
}


const reduceMap = createReducerMap<GameState>()

reduceMap.addReducer(STATE_CHAR_UPDATE, updateCharReducer)
reduceMap.addReducer(STATE_INCREASE_EXP, increaseExpReducer)


const gameStateReducer = (state: GameState = initialState, action: AnyAction) => {
    return reduceMap.reduce(state, action)
}

export default gameStateReducer