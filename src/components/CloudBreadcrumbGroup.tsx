import { BreadcrumbGroup, BreadcrumbGroupProps } from "@cloudscape-design/components"
import { useNavigate } from "react-router-dom"

export default function CloudBreadcrumbGroup(props: BreadcrumbGroupProps) {
  const navigate = useNavigate()

  return (
    <BreadcrumbGroup
      {...props}
      onClick={e => {
        e.preventDefault()
        const { detail } = e
        if (!detail.href) return
        navigate(detail.href)
      }}
    />
  )
}
