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

  // eslint-disable-next-line no-console
  console.log('Rendering day:', day.format('YYYY-MM-DD'))

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
          backgroundColor: isSelected ? 'lightgreen' : 'transparent',
          color: theme => (isSelected ? 'black' : theme.palette.primary.main),
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
  // Extract unique days with tasks
  const highlightedDays = useMemo(() => {
    return schedule
      .map((task) => {
        return dayjs(task.date).format('YYYY-MM-DD')
      })
      .filter(Boolean)
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
