import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../common/reducers"
import "regenerator-runtime/runtime"
import SpeechRecognition from "react-speech-recognition"
import { scrollToBottom, shortUuid, translate } from "../../common/typedUtils.ts"
import store, { appDispatch } from "../../common/store.ts"
import languages from "../../common/languages.json"
import Cookies from "js-cookie"
import { socketManager } from "../../common/clients.ts"
import { InterimTranscription } from "../../../openapi-client"

export interface Result {
  username: string,
  text: string,
  translation?: string,
}

function validateLang(type: "source" | "destination"): string | null {
  const lang = Cookies.get(`${type}Lang`)
  if (lang && Object.keys(languages).includes(lang)) {
    return lang
  } else {
    Cookies.remove(`${type}Lang`)
    return null
  }
}

function getMeetingCode() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get("code")
  return code || shortUuid()
}

export interface SolflareSdkState {
  results: Array<Result>,
  otherInterimResults: Record<string, Result>,
  transcribing: boolean,
  previousEndSeconds?: number,
  sourceLang: string,
  destinationLang: string,
  meetingCode: string,
  joinMeetingModalOpen: boolean,
  newMeetingCode: string,
  autoScroll: boolean,
}

const initialState: SolflareSdkState = {
  results: [],
  otherInterimResults: {},
  transcribing: false,
  previousEndSeconds: undefined,
  sourceLang: validateLang("source") || "Japanese",
  destinationLang: validateLang("destination") || "English",
  meetingCode: getMeetingCode(),
  joinMeetingModalOpen: false,
  newMeetingCode: "",
  autoScroll: true,
}

export const transcribeSlice = createSlice({
  name: "transcribe",
  initialState,
  reducers: {
    updateSlice: (state, action: PayloadAction<Partial<SolflareSdkState>>) => {
      return { ...state, ...action.payload }
    },
    resetSlice: () => {
      return initialState
    },
    updateOtherInterimResult: (state, action: PayloadAction<InterimTranscription>) => {
      const { username, text, id } = action.payload
      if (text) {
        state.otherInterimResults[id!] = {
          username: username!,
          text: text!,
        }
      } else {
        delete state.otherInterimResults[id!]
      }
      if (id === "self") {
        socketManager.sendInterimTranscription({ text })
      }
    },
    startTranscribing: (state) => {
      state.transcribing = true
      const language = languages[state.sourceLang]["web_speech_api_code"]
      SpeechRecognition.startListening({ continuous: true, language })
    },
    stopTranscribing: (state) => {
      state.transcribing = false
      SpeechRecognition.stopListening()
    },
    resetTranscribing: (state) => {
      const keys = ["results", "transcribing", "lastResultTimestamp", "previousEndSeconds"]
      keys.forEach((key) => {
        state[key] = initialState[key]
      })
    },
    addFinalResult: (state, action: PayloadAction<{ text: string, username: string, translation?: string }>) => {
      const { username, text, translation } = action.payload
      state.results.push({ username, text, translation })
      delete state.otherInterimResults["self"]
    },
    resetMeetingModalState: (state) => {
      const keysToReset = ["newMeetingCode", "joinMeetingModalOpen"]
      keysToReset.forEach(key => {
        state[key] = initialState[key]
      })
    },
  },
})

export const addFinalResult = createAsyncThunk(
  "transcribe/addFinalResult",
  async ({ text }: { text: string }) => {
    const { sourceLang, destinationLang } = store.getState().transcribe
    const srcLangCode = languages[sourceLang]["google_translate_code"]
    const destLangCode = languages[destinationLang]["google_translate_code"]
    const translation = await translate(text, srcLangCode, destLangCode)
    appDispatch(transcribeActions.addFinalResult({ text, translation, username: "You" }))
    socketManager.sendFinalTranscription({ text, translation })
    socketManager.sendInterimTranscription({ text: "" })
    appDispatch(scrollToBottom())
  }
)

export const joinMeeting = createAsyncThunk(
  "transcribe/joinMeeting",
  async (meetingCode: string, { dispatch }) => {
    const { username } = store.getState().main
    const oldMeetingCode = store.getState().transcribe.meetingCode
    socketManager.leaveRoom({ room: oldMeetingCode, username })
    socketManager.joinRoom({ room: meetingCode, username })
    const url = new URL(window.location.href)
    url.searchParams.set("code", meetingCode)
    window.history.replaceState({}, "", url)
    dispatch(transcribeActions.resetTranscribing())
    dispatch(transcribeActions.updateSlice({ meetingCode }))
  }
)

export const transcribeReducer = transcribeSlice.reducer
export const transcribeActions = transcribeSlice.actions
export const transcribeSelector = (state: RootState) => state.transcribe
