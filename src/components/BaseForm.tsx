import { ReactNode } from "react"

interface BaseFormProps {
  children: ReactNode
  handleSubmit: () => Promise<void>
}

export default function BaseForm({ children, handleSubmit }: BaseFormProps) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await handleSubmit()
      }}
    >
      {children}
      <button
        type="submit"
        style={{ display: "none" }}
      />
    </form>
  )
}
