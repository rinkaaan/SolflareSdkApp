import { combineReducers } from "@reduxjs/toolkit"
import { mainReducer } from "../routes/mainSlice"
import { transcribeReducer } from "../routes/transcribe/transcribeSlice.ts"

export const reducers = combineReducers({
  main: mainReducer,
  transcribe: transcribeReducer,
})

export type RootState = ReturnType<typeof reducers>
