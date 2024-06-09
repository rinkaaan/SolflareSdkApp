import { Button, ButtonProps } from "@cloudscape-design/components"
import { useNavigate } from "react-router-dom"

export default function CloudButton({ href, onClick, formAction, ...props }: ButtonProps) {
  const navigate = useNavigate()

  return (
    <Button
      {...props}
      onClick={e => {
        if (!onClick) {
          if (formAction !== "submit") {
            e.preventDefault()
          }
          if (!href) return
          navigate(href)
        } else {
          onClick(e)
        }
      }}
    />
  )
}
