import type { Dayjs } from 'dayjs'
import { useReducer } from 'react'

interface UseTaskReducerProps {
  selectedDate: Dayjs | null
}

const taskReducer = (state: Task, action: TaskAction): Task => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value as Task[keyof Task] }
    case 'RESET':
      return {
        taskId: '',
        title: '',
        description: '',
        category: 'work',
        date: action.selectedDate,
        timeRange: undefined,
        priority: 'medium',
        status: 'pending',
        isRecurring: false,
        recurrencePattern: null,
      }
    default:
      return state
  }
}

export const useTaskReducer = ({ selectedDate }: UseTaskReducerProps) => {
  const initialDate = selectedDate?.format('YYYY-MM-DD') ?? new Date().toISOString().split('T')[0]

  const [state, dispatch] = useReducer(
    taskReducer,
    taskReducer(
      {} as Task,
      { type: 'RESET', selectedDate: initialDate },
    ),
  )

  return { state, dispatch, initialDate }
}
