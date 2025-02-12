import type { Dayjs } from 'dayjs'
import { useCalendarHandlers } from '@/hooks'
import { computeHighlightedDays, computeTimeRange } from '@/utils/calendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useMemo } from 'react'
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

const CalendarComponent = ({ schedule, setSelectedDate }: ScheduleCalendarProps) => {
  const { selectedTask, open, handleClose, handleEventClick } = useCalendarHandlers(schedule)

  const highlightedDays = useMemo(() => computeHighlightedDays(schedule), [schedule])
  const timeRange = useMemo(() => computeTimeRange(schedule, '08:00:00', '22:00:00'), [schedule])

  const eventOrder = (a: Task, b: Task): number => {
    if (a.priority === 'medium' && b.priority === 'high') {
      return 1
    }
    else if (a.priority === 'low' && b.priority === 'medium') {
      return 1
    }
    else {
      return -1
    }
  }

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
        events={highlightedDays}
        eventOrder={eventOrder as (a: any, b: any) => number}
        editable
        selectable
        height="auto"
        dayHeaderFormat={{ weekday: 'narrow' }}
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
