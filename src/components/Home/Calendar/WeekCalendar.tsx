import type { Dayjs } from 'dayjs'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useToggle } from '@zl-asica/react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import TaskDialog from './TaskDialog'

import './WeekCalendar.less'

interface ScheduleCalendarProps {
  schedule: Schedule
  setSelectedDate: (date: Dayjs) => void
}

const CalendarComponent = ({ schedule, setSelectedDate }: ScheduleCalendarProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [open, toggleOpen] = useToggle(false)

  const handleTaskClick = (task: Task | null) => {
    setSelectedTask(task)
    toggleOpen()
  }

  const handleClose = () => {
    setSelectedTask(null)
    toggleOpen()
  }
  const highlightedDays = useMemo(() => {
    return schedule
      .map((task) => {
        return {
          ...task,
          id: task.taskId,
          start: task.date,
          backgroundColor: '#4E2A84',
          borderColor: '#4E2A84',
        }
      })
      .filter(Boolean)
  }, [schedule])

  const handleDateClick = (arg: any) => {
    // eslint-disable-next-line ts/no-unsafe-argument, ts/no-unsafe-member-access
    setSelectedDate(dayjs(arg.dateStr))
  }

  return (
    <div
      className="wrapper"
    >
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
        dayHeaderClassNames="dayHeaderClassNames"
        eventClassNames="eventClassNames"
        eventClick={({ event }) => {
          const current: any = schedule?.find(v => v.taskId === event.id)
          // eslint-disable-next-line ts/no-unsafe-argument
          handleTaskClick(current)
        }}
        contentHeight="auto"
        buttonText={{
          today: 'T',
          month: 'M',
          week: 'W',
          day: 'D',
        }}
        dateClick={handleDateClick}
      />
      <TaskDialog
        open={open}
        selectedTask={selectedTask}
        handleClose={handleClose}
      />
    </div>
  )
}

export default CalendarComponent
