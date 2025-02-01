import type { Dayjs } from 'dayjs'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Box } from '@mui/material'
import { useToggle } from '@zl-asica/react'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

import TaskDialog from './TaskDialog'

interface ScheduleCalendarProps {
  schedule: Schedule
  setSelectedDate: (date: Dayjs) => void
}

const calendarStyles = {
  'maxWidth': '100%',
  'boxSizing': 'border-box',
  'padding': '0 12px',
  'marginBottom': '30px',
  '& .fc-timeGridWeek-button, & .fc-dayGridMonth-button, & .fc-next-button, & .fc-prev-button': {
    fontSize: '12px',
    backgroundColor: '#4E2A84 !important',
  },
  '& .fc-toolbar-title': {
    fontSize: '16px',
  },
}

const computeHighlightedDays = (schedule: Schedule) => {
  return schedule.map((task) => {
    const start = task.timeRange
      ? `${task.date}T${task.timeRange.start}`
      : task.date
    const end = task.timeRange
      ? `${task.date}T${task.timeRange.end}`
      : undefined

    const categoryColors: Record<string, string> = {
      work: '#D35400',
      personal: '#3498DB',
      health: '#27AE60',
      learning: '#F1C40F',
      other: '#95A5A6',
      school: '#9B59B6',
      default: '#4E2A84',

    }

    return {
      ...task,
      id: task.taskId,
      start,
      end,
      backgroundColor: categoryColors[task.category] || categoryColors.default,
      borderColor: categoryColors[task.category] || categoryColors.default,
    }
  })
}

const computeTimeRange = (schedule: Schedule, defaultStart: string, defaultEnd: string) => {
  let earliestTime = defaultStart
  let latestTime = defaultEnd

  schedule.forEach((task) => {
    if (task.timeRange) {
      if (task.timeRange.start < earliestTime) {
        earliestTime = task.timeRange.start
      }
      if (task.timeRange.end > latestTime) {
        latestTime = task.timeRange.end
      }
    }
  })

  return { slotMinTime: earliestTime, slotMaxTime: latestTime }
}

const CalendarComponent = ({ schedule, setSelectedDate }: ScheduleCalendarProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [open, toggleOpen] = useToggle()

  const handleTaskClick = useCallback((task: Task | undefined) => {
    setSelectedTask(task ?? null)
    toggleOpen()
  }, [toggleOpen])

  const handleClose = useCallback(() => {
    setSelectedTask(null)
    toggleOpen()
  }, [toggleOpen])

  const highlightedDays = useMemo(
    () => computeHighlightedDays(schedule),
    [schedule],
  )

  const timeRange = useMemo(
    () => computeTimeRange(schedule, '08:00:00', '22:00:00'),
    [schedule],
  )

  const handleEventClick = useCallback(
    ({ event }: { event: { id: string } }) => {
      const task = schedule.find(v => v.taskId === event.id)
      handleTaskClick(task)
    },
    [schedule, handleTaskClick],
  )

  return (
    <Box sx={calendarStyles}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={highlightedDays}
        editable
        selectable
        height="auto"
        dayHeaderFormat={{
          weekday: 'narrow',
        }}
        eventClick={handleEventClick}
        contentHeight="auto"
        slotMinTime={timeRange.slotMinTime}
        slotMaxTime={timeRange.slotMaxTime}
        buttonText={{
          today: 'T',
          month: 'M',
          week: 'W',
          day: 'D',
        }}
        dateClick={arg => setSelectedDate(dayjs(arg.dateStr))}
      />
      <TaskDialog open={open} selectedTask={selectedTask} handleClose={handleClose} />
    </Box>
  )
}

export default CalendarComponent
