import { Link, LinkProps } from "@cloudscape-design/components"
import { useNavigate } from "react-router-dom"

export default function CloudLink({ href, ...props }: LinkProps) {
  const navigate = useNavigate()

  return (
    <Link
      {...props}
      onFollow={e => {
        e.preventDefault()
        if (!href) return
        navigate(href)
      }}
    />
  )
}
