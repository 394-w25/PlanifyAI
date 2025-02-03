import type { Dayjs } from 'dayjs'
import { useCalendarHandlers } from '@/hooks'
import { computeHighlightedDays, computeTimeRange } from '@/utils/calendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
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

  const [selectedDate, setInternalSelectedDate] = useState<Dayjs | null>(null)

  const highlightedDays = useMemo(() => computeHighlightedDays(schedule), [schedule])
  const timeRange = useMemo(() => computeTimeRange(schedule, '08:00:00', '22:00:00'), [schedule])

  const handleDateClick = (arg: { dateStr: string }) => {
    const clickedDate = dayjs(arg.dateStr)
    setSelectedDate(clickedDate)
    setInternalSelectedDate(clickedDate)
  }

  return (
    <Box sx={calendarStyles}>
      <FullCalendar
        key={selectedDate?.format('YYYY-MM-DD')}
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
        dateClick={handleDateClick}
        dayCellDidMount={(arg) => {
          const isSelected = selectedDate?.isSame(dayjs(arg.date), 'day')

          const isToday = dayjs(arg.date).isSame(dayjs(), 'day')

          if (isToday) {
            arg.el.style.backgroundColor = '#F6D55C'
            arg.el.style.borderRadius = '8px'
            arg.el.style.transition = 'background-color 0.3s ease'
          }
          else if (isSelected) {
            arg.el.style.backgroundColor = '#E0BBE4'
            arg.el.style.borderRadius = '8px'
            arg.el.style.transition = 'background-color 0.3s ease'
          }
          else {
            arg.el.style.backgroundColor = 'transparent'
          }
        }}
      />
      <TaskDialog open={open} selectedTask={selectedTask} handleClose={handleClose} />
    </Box>
  )
}

export default CalendarComponent
