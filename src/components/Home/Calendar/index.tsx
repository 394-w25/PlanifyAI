import type { Dayjs } from 'dayjs'
import { useScheduleStore } from '@/stores'
import { Box } from '@mui/material'

import dayjs from 'dayjs'
import { useState } from 'react'
import AddTaskButton from './AddTaskButton'
import CalendarComponent from './CalendarComponent'
import ExportWholeCalendar from './ExportWholeCalendar'

import TaskList from './TaskList'

const Schedule = () => {
  const schedule = useScheduleStore(state => state.schedule)

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())

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

      <AddTaskButton selectedDate={selectedDate} />

      <TaskList tasks={tasksForSelectedDate} />

    </Box>
  )
}

export default Schedule
