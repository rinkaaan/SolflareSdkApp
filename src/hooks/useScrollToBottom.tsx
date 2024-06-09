import { useEffect } from "react"

export default function useScrollToBottom(callback: () => void, disabled = false) {
  useEffect(() => {
    if (disabled) {
      return
    }

    function handleScroll() {
      const totalPageHeight = document.documentElement.scrollHeight
      const scrollPoint = window.innerHeight + document.documentElement.scrollTop
      const distanceFromBottom = totalPageHeight - scrollPoint
      // console.log(`distanceFromBottom: ${distanceFromBottom}`)

      // You can still check if the user is at the bottom and do something
      if (distanceFromBottom < 100) {
        callback()
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll)
  }, [callback, disabled])
}
