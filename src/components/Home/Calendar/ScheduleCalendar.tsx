/* eslint-disable ts/strict-boolean-expressions */
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import type { Dayjs } from 'dayjs'
import Badge from '@mui/material/Badge'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const defaultHighlightedDays: string[] = []

// Helper function to generate dates for recurring tasks
const generateRecurringDates = (task: Task): string[] => {
  if (!task.isRecurring || !task.recurrencePattern) {
    return [task.date]
  }

  const dates: string[] = []
  const startDate = dayjs(task.date)
  const endDate = task.recurrencePattern.endDate
    ? dayjs(task.recurrencePattern.endDate)
    // If no end date, generate for next 6 months
    : dayjs().add(6, 'month')

  let currentDate = startDate
  const { type, interval } = task.recurrencePattern

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    dates.push(currentDate.format('YYYY-MM-DD'))

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

  return dates
}

const ServerDay = (
  props: PickersDayProps<Dayjs> & { highlightedDays?: string[] },
) => {
  const { highlightedDays = defaultHighlightedDays, day, outsideCurrentMonth, ...other } = props

  const isSelected = !outsideCurrentMonth && highlightedDays.includes(day.format('YYYY-MM-DD'))

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '•' : undefined}
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '30px',
          color: theme => theme.palette.primary.main,
        },
      }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  )
}

interface ScheduleCalendarProps {
  schedule: Schedule
  setSelectedDate: (date: Dayjs) => void
}

const ScheduleCalendar = ({ schedule, setSelectedDate }: ScheduleCalendarProps) => {
  // Generate all dates including recurring ones
  const highlightedDays = useMemo(() => {
    const allDates = schedule.flatMap(task => generateRecurringDates(task))

    // Remove duplicates and sort
    return [...new Set(allDates)].sort()
  }, [schedule])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        onChange={setSelectedDate}
        slots={{
          day: dayProps => (
            <ServerDay {...dayProps} highlightedDays={highlightedDays} />
          ),
        }}
      />
    </LocalizationProvider>
  )
}

export default ScheduleCalendar
