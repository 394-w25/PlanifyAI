import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import dayjs from 'dayjs'

interface TaskDialogProps {
  open: boolean
  selectedTask: Task | null
  handleClose: () => void
}

const TaskDialog = ({ open, selectedTask, handleClose }: TaskDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent>
        {selectedTask && (
          <>
            <Typography variant="subtitle1" fontWeight="bold">
              Title:
            </Typography>
            <Typography>{selectedTask.title}</Typography>

            <Typography variant="subtitle1" fontWeight="bold" mt={2}>
              Description:
            </Typography>
            <Typography>{selectedTask.description}</Typography>

            <Typography variant="subtitle1" fontWeight="bold" mt={2}>
              Date & Time:
            </Typography>
            <Typography>
              {dayjs(selectedTask.date).format('MMMM D, YYYY, h:mm A')}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskDialog
