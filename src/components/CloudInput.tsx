import { Input, InputProps } from "@cloudscape-design/components"
import { useState } from "react"

type CloudInputProps = Omit<InputProps, "value" | "onChange">

export default function CloudInput({ ...props }: CloudInputProps) {
  const [value, setValue] = useState("")

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.detail.value)}
    />
  )
}
