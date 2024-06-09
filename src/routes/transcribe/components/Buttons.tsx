import { Button, CopyToClipboard, Toggle } from "@cloudscape-design/components"
import { appDispatch } from "../../../common/store.ts"
import { joinMeeting, transcribeActions, transcribeSelector } from "../transcribeSlice.ts"
import languages from "../../../common/languages.json"
import _ from "lodash"
import { useSelector } from "react-redux"
import { shortUuid } from "../../../common/typedUtils.ts"
import { Breakpoints } from "../../../common/constants.ts"
import { mainActions } from "../../mainSlice.ts"

export function SolflareSdkButton() {
  const { transcribing, sourceLang, destinationLang } = useSelector(transcribeSelector)

  if (transcribing) {
    return (
      <Button
        iconName="microphone-off"
        onClick={() => appDispatch(transcribeActions.stopTranscribing())}
      >
        Stop {_.upperCase(languages[sourceLang]["google_translate_code"])} to {_.upperCase(languages[destinationLang]["google_translate_code"])}
      </Button>
    )
  }

  return (
    <Button
      iconName="microphone"
      onClick={() => appDispatch(transcribeActions.startTranscribing())}
    >
      SolflareSdk {_.upperCase(languages[sourceLang]["google_translate_code"])} to {_.upperCase(languages[destinationLang]["google_translate_code"])}
    </Button>
  )
}

export function AutoScrollToggle() {
  const { autoScroll } = useSelector(transcribeSelector)

  return (
    <Toggle
      onChange={({ detail }) =>
        appDispatch(transcribeActions.updateSlice({ autoScroll: detail.checked }))
      }
      checked={autoScroll}
    >
      Auto scroll
    </Toggle>
  )
}

export function JoinMeetingButton() {
  return (
    <Button
      iconName="angle-right"
      onClick={() => appDispatch(transcribeActions.updateSlice({ joinMeetingModalOpen: true }))}
    >
      Join meeting
    </Button>
  )
}

export function NewMeetingButton() {
  function newMeeting() {
    const newCode = shortUuid()
    appDispatch(joinMeeting(newCode))
    if (window.innerWidth <= Breakpoints.xSmall) {
      appDispatch(mainActions.updateSlice({ toolsOpen: false }))
    }
  }

  return (
    <Button
      iconName="add-plus"
      onClick={newMeeting}
    >
      New meeting
    </Button>
  )
}

export function CopyMeetingUrlButton() {
  return (
    <CopyToClipboard
      copyButtonText="Copy meeting URL"
      copyErrorText="Failed to copy meeting URL"
      copySuccessText="Meeting URL copied"
      textToCopy={window.location.href}
    />
  )
}
