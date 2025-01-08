import CustomDialog from './CustomDialog'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'error'
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
    />
  )
}

export default ConfirmationDialog
