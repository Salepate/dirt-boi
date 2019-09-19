import { AnyAction } from "redux";

interface SubReducerMap<T> {
    [action: string]: (base: T, action: AnyAction) => T
}
export type ReducerContainer<T> = {
    reducers: SubReducerMap<T>
    reduce: (state: T, action: AnyAction) => T
    addReducer: (action: string, reducer: (base: T, action: AnyAction) => T) => void
}

export const createReducerMap = <T>(): ReducerContainer<T> => {
    let container: ReducerContainer<T>;
    let map: SubReducerMap<T> = {}

    const reducer = (state: T, action: AnyAction) => {
        if ( map[action.type] ) {
            return map[action.type](state, action)
        } else {
            console.warn(`unknown reducer action ${action.type} for store ${typeof state}`)
            return state
        }
    }

    const addReducer = (action: string, reducer: (base: T, action: AnyAction) => T ) => {
        map[action] = reducer
    }

    return {
        reducers: map,
        reduce: reducer,
        addReducer: addReducer
    }
}

