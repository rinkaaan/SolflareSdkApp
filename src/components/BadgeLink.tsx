import { Link, LinkProps } from "react-router-dom"
import "./BadgeLink.css"

export default function BadgeLink(props: LinkProps) {
  return (
    <Link {...props} className="badge-link">
      {props.children}
    </Link>
  )
}
