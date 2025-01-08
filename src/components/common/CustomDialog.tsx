import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface DialogAction {
  text: string
  onClick: () => void
  color?: 'primary' | 'error' | 'secondary' | 'inherit'
}

interface CustomDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  actions?: DialogAction[] // Array of actions for buttons
  children?: React.ReactNode // Custom content
}

const defaultActions: DialogAction[] = []

const CustomDialog = ({
  open,
  onClose,
  title,
  description,
  actions = defaultActions,
  children,
}: CustomDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="custom-dialog-title"
      aria-describedby="custom-dialog-description"
    >
      <DialogTitle id="custom-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {description?.trim() ?? (
          <DialogContentText id="custom-dialog-description">
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogActions>
        {actions.map(action => (
          <Button
            key={action.text}
            onClick={action.onClick}
            color={action.color || 'primary'}
          >
            {action.text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  )
}

export default CustomDialog
