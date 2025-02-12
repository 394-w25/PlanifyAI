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
  description?: string | React.ReactNode
  actions?: DialogAction[] // Array of actions for buttons
  children?: React.ReactNode // Custom content
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fullWidth?: boolean
}

const defaultActions: DialogAction[] = []

const CustomDialog = ({
  open,
  onClose,
  title,
  description,
  actions = defaultActions,
  children,
  maxWidth = 'md',
  fullWidth = true,
}: CustomDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="custom-dialog-title"
      aria-describedby="custom-dialog-description"
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle id="custom-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {
          typeof description === 'string'
            ? description?.trim() ?? (
              <DialogContentText id="custom-dialog-description">
                {description}
              </DialogContentText>
            )
            : description
        }
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
