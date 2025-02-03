import type { Dayjs } from 'dayjs'
import { useScheduleStore } from '@/stores'
import { Box, Button } from '@mui/material'
import { useToggle } from '@zl-asica/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import CalendarComponent from './CalendarComponent'
import ExportWholeCalendar from './ExportWholeCalendar'
import TaskInputDialog from './TaskInputDialog'
import TaskList from './TaskList'

const Schedule = () => {
  const schedule = useScheduleStore(state => state.schedule)

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [openAddTask, toggleOpenAddTask] = useToggle()

  const tasksForSelectedDate = schedule.filter(task =>
    dayjs(task.date).isSame(selectedDate, 'day'),
  )

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CalendarComponent schedule={schedule} setSelectedDate={setSelectedDate} />

      <ExportWholeCalendar />

      <Button
        onClick={toggleOpenAddTask}
        variant="contained"
        sx={{
          p: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          mb: '1rem',
        }}
      >
        Add Task
      </Button>

      <TaskInputDialog
        selectedDate={selectedDate}
        open={openAddTask}
        toggleOpen={toggleOpenAddTask}
        action="Add"
      />

      <TaskList selectedDate={selectedDate} tasks={tasksForSelectedDate} />

    </Box>
  )
}

export default Schedule
