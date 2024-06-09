import { HelpPanel, SpaceBetween } from "@cloudscape-design/components"
import { AutoScrollToggle, CopyMeetingUrlButton, JoinMeetingButton, NewMeetingButton, SolflareSdkButton } from "./Buttons.tsx"
import { mainSelector } from "../../mainSlice.ts"
import { useSelector } from "react-redux"

export default function Tools() {
  const { username } = useSelector(mainSelector)

  return (
    <HelpPanel header={<h2>Welcome {username}</h2>}>
      <SpaceBetween
        size="s"
        direction="horizontal"
        alignItems="center"
      >
        <SolflareSdkButton />
        <CopyMeetingUrlButton />
        <NewMeetingButton />
        <JoinMeetingButton />
        <AutoScrollToggle />
      </SpaceBetween>
    </HelpPanel>
  )
}
