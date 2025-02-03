import dayjs from 'dayjs'

const categoryColors: Record<TaskCategory, string> = {
  work: '#D35400',
  personal: '#3498DB',
  health: '#27AE60',
  learning: '#F1C40F',
  other: '#95A5A6',
  school: '#9B59B6',
  holiday: '#E74C3C',
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

export const generateRecurringEvents = (task: Task) => {
  if (!task.isRecurring || !task.recurrencePattern) {
    return [{
      ...task,
      id: task.taskId,
      start: task.timeRange ? `${task.date}T${task.timeRange.start}` : task.date,
      end: task.timeRange ? `${task.date}T${task.timeRange.end}` : undefined,
      backgroundColor: categoryColors[task.category] || '#4E2A84',
      borderColor: categoryColors[task.category] || '#4E2A84',
      title: task.title,
    }]
  }

  const events = []
  const startDate = dayjs(task.date)
  const endDate = dayjs(task.recurrencePattern.endDate) ?? dayjs().add(6, 'month') // Default to 6 months

  let currentDate = startDate
  const { type, interval } = task.recurrencePattern

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    const currentDateStr = currentDate.format('YYYY-MM-DD')
    events.push({
      ...task,
      id: `${task.taskId}-${currentDateStr}`,
      start: task.timeRange ? `${currentDateStr}T${task.timeRange.start}` : currentDateStr,
      end: task.timeRange ? `${currentDateStr}T${task.timeRange.end}` : undefined,
      backgroundColor: categoryColors[task.category] || '#4E2A84',
      borderColor: categoryColors[task.category] || '#4E2A84',
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

export const computeHighlightedDays = (schedule: Schedule) => {
  const userSchedule = schedule.flatMap(task => generateRecurringEvents(task))
  return [...userSchedule, ...HOLIDAY_EVENTS]
}

export const computeTimeRange = (schedule: Schedule, defaultStart: string, defaultEnd: string) => {
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
