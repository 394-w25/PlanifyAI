import type { Dayjs } from 'dayjs'
import { useEffect, useReducer } from 'react'

interface UseTaskReducerProps {
  selectedDate: Dayjs
  currentTask?: Task | null
  open: boolean
}

const taskReducer = (state: Task, action: TaskAction): Task => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return action.currentTask ?? {
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

export const useTaskReducer = ({ selectedDate, currentTask, open }: UseTaskReducerProps) => {
  const initialDate = selectedDate?.format('YYYY-MM-DD') ?? new Date().toISOString().split('T')[0]

  const [state, dispatch] = useReducer(
    taskReducer,
    currentTask ?? {
      taskId: '',
      title: '',
      description: '',
      category: 'work',
      date: initialDate,
      timeRange: undefined,
      priority: 'medium',
      status: 'pending',
      isRecurring: false,
      recurrencePattern: null,
    },
  )

  useEffect(() => {
    dispatch({ type: 'SET_FIELD', field: 'date', value: initialDate })
  }, [selectedDate])

  useEffect(() => {
    dispatch({ type: 'RESET', selectedDate: initialDate, currentTask })
  }, [currentTask, open])

  return { state, dispatch, initialDate }
}
