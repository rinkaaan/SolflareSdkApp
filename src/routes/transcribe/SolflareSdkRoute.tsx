import { Box, ContentLayout, Header, SpaceBetween, Table } from "@cloudscape-design/components"
import "./style.css"
import { useSelector } from "react-redux"
import { transcribeSelector } from "./transcribeSlice.ts"
import { useEffect } from "react"
import { mainActions, mainSelector } from "../mainSlice.ts"
import { useLocation } from "react-router-dom"
import useSocketEvents from "./hooks/useSocketEvents.tsx"
import { CopyMeetingUrlButton, JoinMeetingButton, NewMeetingButton, SolflareSdkButton } from "./components/Buttons.tsx"
import useSpeechRecognitionEvents from "./hooks/useTranscriptHooks.tsx"
import { appDispatch } from "../../common/store.ts"
import Tools from "./components/Tools.tsx"

export function Component() {
  useSocketEvents()
  useSpeechRecognitionEvents()
  const location = useLocation()
  const { toolsOpen, username } = useSelector(mainSelector)
  const { results, otherInterimResults, meetingCode } = useSelector(transcribeSelector)

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set("code", meetingCode)
    window.history.replaceState({}, "", url)
  }, [location])

  useEffect(() => {
    appDispatch(mainActions.updateSlice({ tools: <Tools />, toolsHidden: false }))

    return () => {
      appDispatch(mainActions.updateSlice({ toolsHidden: true }))
    }
  }, [])

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          actions={!toolsOpen && (
            <SpaceBetween size="s" direction="horizontal" alignItems="center">
              {username !== "Anonymous" && <div>Welcome {username}</div>}
              <SolflareSdkButton />
            </SpaceBetween>
          )}
        >
          SolflareSdk | {meetingCode}
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Table
          columnDefinitions={[
            {
              header: "",
              cell: item => item.username,
            },
            {
              header: "",
              cell: item => (
                <div className="result">
                  <div>{item.text}</div>
                  <div className="translation">{item.translation}</div>
                </div>
              ),
              width: "100%",
            },
          ]}
          items={[
            ...results,
            ...Object.values(otherInterimResults),
          ]}
          loadingText="Loading resources"
          sortingDisabled
          empty={
            <Box
              margin={{ vertical: "xs" }}
              textAlign="center"
              color="inherit"
            >
              <SpaceBetween size="m">
                <b>No words spoken yet</b>
                Share the meeting URL with others to let them join the transcription session.
                <CopyMeetingUrlButton />
                <NewMeetingButton />
                <JoinMeetingButton />
              </SpaceBetween>
            </Box>
          }
        />
      </SpaceBetween>
    </ContentLayout>
  )
}
