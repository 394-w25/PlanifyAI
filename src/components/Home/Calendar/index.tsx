import type { Dayjs } from 'dayjs'
import { generateCombinedICSFile, generateICSFile } from '@/utils/generateICSFile'
import { CalendarMonth, FileDownload } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'

import { useState } from 'react'
import TasksCalendar from './TasksCalendar'

const ScheduleBase = () => {
  const tasks: Task[] = [
    {
      taskId: 'a',
      date: '2025-01-08',
      title: 'Placeholder Task 1',
      description: 'This is a placeholder task for January 8th.',
    },
    {
      taskId: 'b',
      date: '2025-01-09',
      title: 'Placeholder Task 2',
      description: 'This is a placeholder task for January 9th.',
    },
    {
      taskId: 'c',
      date: '2025-01-11',
      title: 'Placeholder Task 3',
      description: 'This is a placeholder task for January 11th.',
    },
  ]

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [open, setOpen] = useState(false)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedTask(null)
  }

  const tasksForSelectedDate = tasks.filter(task =>
    dayjs(task.date).isSame(selectedDate, 'day'),
  )

  return (
    <Box sx={{ p: 2 }}>

      <TasksCalendar tasks={tasks} setSelectedDate={setSelectedDate} />

      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <Button
            onClick={() => generateCombinedICSFile(tasks)}
            variant="contained"
            sx={{
              p: '0.5rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FileDownload sx={{ marginRight: '0.5rem' }} />
            Export All to Calendar
          </Button>
        </Box>

        {tasksForSelectedDate.length > 0
          ? (
              tasksForSelectedDate.map(task => (
                <Box
                  key={task.taskId}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onClick={() => handleTaskClick(task)}
                >
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {task.title}
                    </Typography>
                    <Typography variant="body2">
                      {task.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(task.date).format('MMMM D, YYYY, h:mm A')}
                    </Typography>
                  </Box>

                  <IconButton
                    color="primary"
                    onClick={() => generateICSFile(task)}
                    sx={{ fontSize: 12, display: 'flex', flexDirection: 'column' }}
                  >
                    <CalendarMonth fontSize="large" />
                    Export to Calendar
                  </IconButton>
                </Box>
              ))
            )
          : (
              <Typography variant="body1" color="text.secondary">
                No tasks for this date.
              </Typography>
            )}
      </>

      {/* Task Details Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
              >
                Title:
              </Typography>
              <Typography>{selectedTask.title}</Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mt={2}
              >
                Description:
              </Typography>
              <Typography>{selectedTask.description}</Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mt={2}
              >
                Date & Time:
              </Typography>
              <Typography>
                {dayjs(selectedTask.date).format('MMMM D, YYYY, h:mm A')}
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mt={2}
              >
                Supplies:
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ScheduleBase
