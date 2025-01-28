/* eslint-disable ts/strict-boolean-expressions */
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

const generateRecurringEvents = (task: Task) => {
  if (!task.isRecurring || !task.recurrencePattern) {
    return [{
      ...task,
      id: task.taskId,
      start: task.timeRange ? `${task.date}T${task.timeRange.start}` : task.date,
      end: task.timeRange ? `${task.date}T${task.timeRange.end}` : undefined,
      backgroundColor: '#4E2A84',
      borderColor: '#4E2A84',
      title: task.title,
    }]
  }

  const events = []
  const startDate = dayjs(task.date)
  const endDate = task.recurrencePattern.endDate
    ? dayjs(task.recurrencePattern.endDate)
    : dayjs().add(6, 'month') // Default to 6 months if no end date

  let currentDate = startDate
  const { type, interval } = task.recurrencePattern

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    const currentDateStr = currentDate.format('YYYY-MM-DD')
    events.push({
      ...task,
      id: `${task.taskId}-${currentDateStr}`, // Unique ID for each occurrence
      start: task.timeRange ? `${currentDateStr}T${task.timeRange.start}` : currentDateStr,
      end: task.timeRange ? `${currentDateStr}T${task.timeRange.end}` : undefined,
      backgroundColor: '#4E2A84',
      borderColor: '#4E2A84',
      title: `${task.title} (Recurring)`,
      extendedProps: {
        originalTaskId: task.taskId,
        isRecurringInstance: true,
      },
    })

    switch (type) {
      case 'daily':
        currentDate = currentDate.add(interval, 'day')
        break
      case 'weekly':
        currentDate = currentDate.add(interval, 'week')
        break
      case 'monthly':
        currentDate = currentDate.add(interval, 'month')
        break
    }
  }

  return events
}

const computeHighlightedDays = (schedule: Schedule) => {
  return schedule.flatMap(task => generateRecurringEvents(task))
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
    ({ event }: { event: { id: string, extendedProps?: { originalTaskId?: string } } }) => {
      // For recurring instances, find the original task
      const taskId = event.extendedProps?.originalTaskId || event.id.split('-')[0]
      const task = schedule.find(v => v.taskId === taskId)
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
