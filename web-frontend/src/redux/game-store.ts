import { combineReducers } from "redux";
import gameStateReducer from "./game-state-reducer";

export const rootReducer = combineReducers({gameState: gameStateReducer})

type GameStore = ReturnType<typeof rootReducer>

export default GameStore