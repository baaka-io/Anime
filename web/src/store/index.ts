import { createStore, combineReducers } from "redux"
import { identity, defaultTo, pipe } from "ramda"

//Keep this until the first reducer exists, then you can remove it.
const rootReducer = combineReducers([
  pipe(
    defaultTo<any>({}),
    identity
  )
])
const store = createStore(rootReducer)

export default store
