import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import dayjs from 'dayjs'

interface TaskDialogProps {
  open: boolean
  selectedTask: Task | null
  handleClose: () => void
}

const TaskDialog = ({ open, selectedTask, handleClose }: TaskDialogProps) => {
  let actualDateTime = dayjs(selectedTask?.date).format('MMMM D, YYYY')

  if (selectedTask?.timeRange) {
    const [hour, minute] = selectedTask.timeRange.start.split(':').map(Number)
    const isPM = hour >= 12
    const formattedHour = isPM ? hour - 12 || 12 : hour || 12 // Converts 0 to 12 for AM/PM notation
    const formattedMinute = minute ? `:${minute.toString().padStart(2, '0')}` : ''

    actualDateTime = `${formattedHour}${formattedMinute} ${isPM ? 'PM' : 'AM'}, ${actualDateTime}`
  }

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
              Date & Time:
            </Typography>
            <Typography>
              {actualDateTime}
            </Typography>

            {selectedTask.description !== '' && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                  Description:
                </Typography>
                <Typography>{selectedTask.description}</Typography>
              </>
            )}
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
