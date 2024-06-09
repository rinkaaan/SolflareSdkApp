import { useEffect } from "react"
import { socketManager } from "../../../common/clients.ts"
import { appDispatch } from "../../../common/store.ts"
import { transcribeActions } from "../transcribeSlice.ts"
import { scrollToBottom } from "../../../common/typedUtils.ts"
import { FinalTranscription, InterimTranscription, Message } from "../../../../openapi-client"

export default function useSocketEvents() {
  useEffect(() => {
    socketManager.receiveFinalTranscription((message: FinalTranscription) => {
      appDispatch(
        transcribeActions.addFinalResult({
          text: message.text!,
          username: message.username!,
          translation: message.translation,
        }),
      )
      appDispatch(scrollToBottom())
    })

    socketManager.receiveInterimTranscription((payload: InterimTranscription) => {
      appDispatch(transcribeActions.updateOtherInterimResult(payload))
      appDispatch(scrollToBottom())
    })

    socketManager.receiveMessage((message: Message) => {
      appDispatch(transcribeActions.addFinalResult({ text: message.text!, username: message.username! }))
      appDispatch(scrollToBottom())
    })

    return () => {
      appDispatch(transcribeActions.stopTranscribing())
    }
  }, [])
}
