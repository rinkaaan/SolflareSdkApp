import { combineReducers } from "@reduxjs/toolkit"
import { mainReducer } from "../routes/mainSlice"

export const reducers = combineReducers({
  main: mainReducer,
})

export type RootState = ReturnType<typeof reducers>
