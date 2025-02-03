import dayjs from 'dayjs'

const categoryColors: Record<TaskCategory, string> = {
  work: '#D35400',
  personal: '#3498DB',
  health: '#27AE60',
  learning: '#F1C40F',
  other: '#95A5A6',
  school: '#9B59B6',
}

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
  return schedule.flatMap(task => generateRecurringEvents(task))
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
