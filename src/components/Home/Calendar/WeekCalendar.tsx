import type { EventClickArg } from '@fullcalendar/core'
import type { Dayjs } from 'dayjs'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
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
    const timeRange = task.timeRange // store in a variable
    let start = task.date
    let end: string | undefined

    if (timeRange !== undefined && timeRange !== null) {
      // Now TS knows timeRange is definitely not undefined here
      start = `${task.date}T${timeRange.start}`
      end = `${task.date}T${timeRange.end}`
    }

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
      backgroundColor: categoryColors[task.category] ?? categoryColors.default,
      borderColor: categoryColors[task.category] ?? categoryColors.default,
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

// holidays from chatgpt
const HOLIDAY_EVENTS = [
  { title: 'New Year\'s Day', color: '#FFD700', rrule: { freq: 'yearly', bymonth: 1, bymonthday: 1, dtstart: '2024-01-01T00:00:00' }, allDay: true },
  { title: 'Valentine\'s Day', color: '#FF69B4', rrule: { freq: 'yearly', bymonth: 2, bymonthday: 14, dtstart: '2024-02-14T00:00:00' }, allDay: true },
  { title: 'April Fools\' Day', color: '#FF4500', rrule: { freq: 'yearly', bymonth: 4, bymonthday: 1, dtstart: '2024-04-01T00:00:00' }, allDay: true },
  { title: 'Earth Day', color: '#228B22', rrule: { freq: 'yearly', bymonth: 4, bymonthday: 22, dtstart: '2024-04-22T00:00:00' }, allDay: true },
  { title: 'Mother\'s Day', color: '#FFB6C1', rrule: { freq: 'yearly', bymonth: 5, bymonthday: 12, dtstart: '2024-05-12T00:00:00' }, allDay: true },
  { title: 'Memorial Day', color: '#B22222', rrule: { freq: 'yearly', bymonth: 5, bymonthday: 27, dtstart: '2024-05-27T00:00:00' }, allDay: true },
  { title: 'Father\'s Day', color: '#4682B4', rrule: { freq: 'yearly', bymonth: 6, bymonthday: 16, dtstart: '2024-06-16T00:00:00' }, allDay: true },
  { title: 'Independence Day (US)', color: '#FF0000', rrule: { freq: 'yearly', bymonth: 7, bymonthday: 4, dtstart: '2024-07-04T00:00:00' }, allDay: true },
  { title: 'Labor Day (US)', color: '#4682B4', rrule: { freq: 'yearly', bymonth: 9, bymonthday: 2, dtstart: '2024-09-02T00:00:00' }, allDay: true },
  { title: 'Halloween', color: '#FF8C00', rrule: { freq: 'yearly', bymonth: 10, bymonthday: 31, dtstart: '2024-10-31T00:00:00' }, allDay: true },
  { title: 'Thanksgiving (US)', color: '#D2691E', rrule: { freq: 'yearly', bymonth: 11, bymonthday: 28, dtstart: '2024-11-28T00:00:00' }, allDay: true },
  { title: 'Christmas Eve', color: '#008000', rrule: { freq: 'yearly', bymonth: 12, bymonthday: 24, dtstart: '2024-12-24T00:00:00' }, allDay: true },
  { title: 'Christmas Day', color: '#FF0000', rrule: { freq: 'yearly', bymonth: 12, bymonthday: 25, dtstart: '2024-12-25T00:00:00' }, allDay: true },
  { title: 'New Year\'s Eve', color: '#C0C0C0', rrule: { freq: 'yearly', bymonth: 12, bymonthday: 31, dtstart: '2024-12-31T00:00:00' }, allDay: true },
]

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

  const allEvents = useMemo(() => {
    const taskEvents = computeHighlightedDays(schedule)
    return [...taskEvents, ...HOLIDAY_EVENTS]
  }, [schedule])

  const timeRange = useMemo(
    () => computeTimeRange(schedule, '08:00:00', '22:00:00'),
    [schedule],
  )

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      // clickInfo.event is a FullCalendar EventApi object
      const foundTask = schedule.find(t => t.taskId === clickInfo.event.id)
      if (foundTask) {
        handleTaskClick(foundTask)
      }
      else {
        // Build a fallback Task object for holidays
        const holidayFallback: Task = {
          taskId: `holiday-${clickInfo.event.id}`,
          title: clickInfo.event.title || 'Holiday',
          date: clickInfo.event.start?.toISOString() ?? '',
          timeRange: null,
          description: '',
          category: 'holiday',
          priority: null,
          status: null,
        }
        handleTaskClick(holidayFallback)
      }
    },
    [schedule, handleTaskClick],
  )

  return (
    <Box sx={calendarStyles}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        // 3. Use the merged array here
        events={allEvents}
        eventClick={handleEventClick}
        // If you want to allow dragging/resizing:
        editable
        // If you want to allow day selection:
        selectable
        dayHeaderFormat={{
          weekday: 'narrow',
        }}
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
