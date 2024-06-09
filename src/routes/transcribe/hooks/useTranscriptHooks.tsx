import { useEffect } from "react"
import { appDispatch } from "../../../common/store.ts"
import { addFinalResult, transcribeActions } from "../transcribeSlice.ts"
import { scrollToBottom } from "../../../common/typedUtils.ts"
import { useSpeechRecognition } from "react-speech-recognition"

export default function useSpeechRecognitionEvents() {
  const { interimTranscript, finalTranscript, resetTranscript } = useSpeechRecognition()

  useEffect(() => {
    if (interimTranscript.trim() === "") return
    appDispatch(transcribeActions.updateOtherInterimResult({ text: interimTranscript, username: "You", id: "self" }))
    appDispatch(scrollToBottom())
  }, [interimTranscript])

  useEffect(() => {
    if (finalTranscript.trim() === "") return
    appDispatch(addFinalResult({ text: finalTranscript }))
    appDispatch(scrollToBottom())
    resetTranscript()
  }, [finalTranscript, resetTranscript])
}
