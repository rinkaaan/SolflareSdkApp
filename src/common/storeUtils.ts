import { FlashbarProps } from "@cloudscape-design/components"
import { appDispatch } from "./store"
import { mainActions } from "../routes/mainSlice"

export function prepareNotifications(notifications: Array<FlashbarProps.MessageDefinition>) {
  return notifications.map(n => ({
    ...n,
    onDismiss: () => {
      if (n.id) {
        appDispatch(mainActions.removeNotification(n.id))
      }
    },
  }))
}
