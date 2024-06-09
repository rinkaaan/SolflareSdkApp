import { Box, Button, FormField, Input, Modal, SpaceBetween } from "@cloudscape-design/components"
import { FormEvent } from "react"
import { joinMeeting, transcribeActions, transcribeSelector } from "../transcribeSlice.ts"
import { useSelector } from "react-redux"
import { appDispatch } from "../../../common/store.ts"
import { Breakpoints } from "../../../common/constants.ts"
import { mainActions } from "../../mainSlice.ts"

export default function JoinMeetingModal() {
  const { joinMeetingModalOpen, newMeetingCode } = useSelector(transcribeSelector)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    joinRoom()
  }

  function joinRoom() {
    appDispatch(joinMeeting(newMeetingCode))
    onClose()
  }

  function onClose() {
    appDispatch(transcribeActions.resetMeetingModalState())
    if (window.innerWidth < Breakpoints.xSmall) {
      appDispatch(mainActions.updateSlice({ toolsOpen: false }))
    }
  }

  return (
    <Modal
      visible={joinMeetingModalOpen}
      header="Join Meeting"
      closeAriaLabel="Close modal"
      onDismiss={onClose}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              variant="link"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={joinRoom}
            >
              Join
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <form onSubmit={onSubmit}>
          <input
            hidden
            type="submit"
          />
          <FormField
            label="Meeting code"
          >
            <Input
              value={newMeetingCode}
              placeholder="Enter value"
              onChange={event => {
                appDispatch(transcribeActions.updateSlice({ newMeetingCode: event.detail.value }))
              }}
            />
          </FormField>
        </form>
      </SpaceBetween>
    </Modal>
  )
}
