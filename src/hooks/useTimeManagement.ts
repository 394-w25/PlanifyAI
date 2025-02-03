import { useMemo } from 'react'

const getNextHour = (time: string): string => {
  const [hour, minute] = time.split(':').map(Number)
  const nextHour = (hour + 1) % 24
  return `${nextHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export const useTimeManagement = (state: Task, dispatch: React.Dispatch<TaskAction>) => {
  const handleStartTimeChange = (val: string) => {
    const newEndTime = state.timeRange?.end ?? getNextHour(val)

    dispatch({
      type: 'SET_FIELD',
      field: 'timeRange',
      value: { start: val, end: newEndTime },
    })
  }

  const getEndTimeColor = useMemo(() => {
    if (state.timeRange?.start == null || state.timeRange?.end == null) {
      return 'primary'
    }
    return state.timeRange.end < state.timeRange.start ? 'secondary' : 'primary'
  }, [state.timeRange])

  return { handleStartTimeChange, getEndTimeColor }
}
