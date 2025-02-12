import CustomDialog from './CustomDialog'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'error'
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  maxWidth,
}: ConfirmationDialogProps) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      actions={[
        {
          text: cancelText,
          onClick: onClose,
        },
        {
          text: confirmText,
          onClick: onConfirm,
          color: confirmColor,
        },
      ]}
      maxWidth={maxWidth}
    />
  )
}

export default ConfirmationDialog
