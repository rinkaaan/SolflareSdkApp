import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FlashbarProps } from "@cloudscape-design/components"
import { shortUuid, uuid } from "../common/typedUtils"
import type { RootState } from "../common/reducers"
import { ReactNode } from "react"
import Cookies from "js-cookie"

export interface MainState {
  navigationOpen: boolean;
  notifications: Array<FlashbarProps.MessageDefinition>;
  lockScroll?: boolean;
  startingPath?: string;
  toolsHidden: boolean;
  toolsOpen: boolean;
  tools: ReactNode;
  username: string;
  userId: string;
}

const initialState: MainState = {
  navigationOpen: false,
  notifications: [],
  lockScroll: false,
  startingPath: undefined,
  toolsHidden: true,
  toolsOpen: false,
  tools: null,
  username: Cookies.get("username") || "Anonymous",
  userId: shortUuid(),
}

type Notification = Pick<FlashbarProps.MessageDefinition, "type" | "content">

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    updateSlice: (state, action: PayloadAction<Partial<MainState>>) => {
      return { ...state, ...action.payload }
    },
    addNotification(state, action: PayloadAction<Notification>) {
      // if there is already a notification with the same content, don't add it
      if (state.notifications.find(n => n.content === action.payload.content)) return
      const notification: FlashbarProps.MessageDefinition = {
        ...action.payload,
        dismissible: true,
        id: uuid(),
      }
      state.notifications.push(notification)
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    resetSlice: () => {
      return initialState
    }
  },
})

export const mainReducer = mainSlice.reducer
export const mainActions = mainSlice.actions
export const mainSelector = (state: RootState) => state.main
