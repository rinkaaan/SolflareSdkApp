import { HelpPanel, SpaceBetween } from "@cloudscape-design/components"
import { ExternalLinkGroup } from "../../components/external-link-group.tsx"

export default function Tools() {
  return (
    <HelpPanel
      header={<h2>Transcribing System Audio</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            {
              href: "https://www.howtogeek.com/39532/how-to-enable-stereo-mix-in-windows-7-to-record-audio/",
              text: "Enabling stereo mix on Windows",
            },
            {
              href: "https://wikis.utexas.edu/display/comm/How+to+set+up+BlackHole+Audio+on+a+Mac",
              text: "Setting up BlackHole on Mac",
            },
          ]}
        />
      }
    >
      <SpaceBetween
        size="s"
        direction="horizontal"
      >
        Although SolflareSdk is mainly intended for use with spoken audio received through a microphone, you can also transcribe audio from your computer by enabling stereo mix for Windows computers or
        using something like BlackHole for Macs.
      </SpaceBetween>
    </HelpPanel>
  )
}
