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

const ServerDay = (
  props: PickersDayProps<Dayjs> & { highlightedDays?: string[] },
) => {
  const { highlightedDays = defaultHighlightedDays, day, outsideCurrentMonth, ...other } = props

  const isSelected
    = !outsideCurrentMonth
    && highlightedDays.includes(day.format('YYYY-MM-DD'))

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

interface TasksCalendarProps {
  tasks: Task[]
  setSelectedDate: (date: Dayjs) => void
}

const TasksCalendar = ({ tasks, setSelectedDate }: TasksCalendarProps) => {
  // Extract unique days with tasks
  const highlightedDays = useMemo(() => {
    return tasks
      .map((tasks) => {
        return dayjs(tasks.date).format('YYYY-MM-DD')
      })
      .filter(Boolean)
  }, [tasks])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        onChange={setSelectedDate}
        slots={{
          day: dayProps => (
            <ServerDay
              {...dayProps}
              highlightedDays={highlightedDays}
            />
          ),
        }}
      />
    </LocalizationProvider>
  )
}

export default TasksCalendar
