import { Box, Button, Modal, SpaceBetween } from "@cloudscape-design/components"
import { ReactNode } from "react"

export default function ConfirmModal({
  confirmText,
  title,
  onConfirm,
  visible,
  onClose,
  children,
  loading,
}: {
  confirmText: string,
  title: string,
  onConfirm: () => void,
  visible: boolean,
  onClose: () => void,
  children: ReactNode,
  loading: boolean,
}) {
  return (
    <Modal
      visible={visible}
      header={title}
      closeAriaLabel="Close modal"
      onDismiss={onClose}
      footer={
        <Box float="right">
          <SpaceBetween
            direction="horizontal"
            size="xs"
          >
            <Button
              variant="link"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      {children}
    </Modal>
  )
}
