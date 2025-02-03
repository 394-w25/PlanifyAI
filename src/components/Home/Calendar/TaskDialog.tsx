import { SmallLoadingCircle } from '@/components/common'
import { useScheduleStore } from '@/stores'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'

interface TaskDialogProps {
  open: boolean
  selectedTask: Task | null
  handleClose: () => void
}

const TaskDialog = ({ open, selectedTask, handleClose }: TaskDialogProps) => {
  const deleteTask = useScheduleStore(state => state.deleteTask)
  const [loading, setLoading] = useState(false)

  let actualDateTime = dayjs(selectedTask?.date).format('MMMM D, YYYY')
  if (selectedTask?.timeRange) {
    const [hour, minute] = selectedTask.timeRange.start.split(':').map(Number)
    const isPM = hour >= 12
    const formattedHour = isPM ? hour - 12 || 12 : hour || 12
    const formattedMinute = minute ? `:${minute.toString().padStart(2, '0')}` : ''
    actualDateTime = `${formattedHour}${formattedMinute} ${isPM ? 'PM' : 'AM'}, ${actualDateTime}`
  }

  const handleDeleteTask = useCallback(async () => {
    setLoading(true)
    try {
      if (selectedTask) {
        await deleteTask(selectedTask.taskId)
      }
    }
    catch (error_) {
      console.error('Error while delete task:', error_)
    }
    finally {
      handleClose()
      setLoading(false)
    }
  }, [deleteTask, handleClose, selectedTask])

  const getRecurrenceText = (pattern: RecurrencePattern): string => {
    const intervalText = pattern.interval === 1 ? '' : `every ${pattern.interval} `
    const typeText = `${pattern.type}${pattern.interval === 1 ? 'ly' : 's'}`
    let text = `Repeats ${intervalText}${typeText}`

    if (pattern.endDate !== null) {
      text += ` until ${dayjs(pattern.endDate).format('MMMM D, YYYY')}`
    }

    return text
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

            {selectedTask.isRecurring && selectedTask.recurrencePattern && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                  Recurrence:
                </Typography>
                <Typography>
                  {getRecurrenceText(selectedTask.recurrencePattern)}
                </Typography>
              </>
            )}

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
        <Button onClick={handleDeleteTask} color="error">
          {loading ? <SmallLoadingCircle text="Delete..." /> : 'Delete'}
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskDialog
