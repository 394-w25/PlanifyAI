import { generateICSFile } from '@/utils/generateICSFile'
import { CalendarMonth } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useToggle } from '@zl-asica/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import TaskDialog from './TaskDialog'

interface TaskListProps {
  tasks: Task[]
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [open, toggleOpen] = useToggle(false)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    toggleOpen()
  }

  const handleClose = () => {
    setSelectedTask(null)
    toggleOpen()
  }

  return (
    <>
      <Box>
        {tasks.length > 0
          ? (tasks.map(task => (
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
                  onClick={(e) => {
                    e.stopPropagation()
                    generateICSFile(task)
                  }}
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
      </Box>

      <TaskDialog open={open} selectedTask={selectedTask} handleClose={handleClose} />
    </>
  )
}

export default TaskList
