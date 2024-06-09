import { FileUpload, FileUploadProps } from "@cloudscape-design/components"

interface CloudFileUploadProps extends FileUploadProps {
  disabled?: boolean
}

export default function CloudFileUpload({ disabled = false, ...props }: CloudFileUploadProps) {
  return (
    <div style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.5 : 1 }}>
      <FileUpload {...props} />
    </div>
  )
}
