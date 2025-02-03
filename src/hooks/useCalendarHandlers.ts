import { useToggle } from '@zl-asica/react'
import { useCallback, useState } from 'react'

export const useCalendarHandlers = (schedule: Schedule) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [open, toggleOpen] = useToggle()

  const handleTaskClick = useCallback((task: Task | undefined) => {
    setSelectedTask(task ?? null)
    toggleOpen()
  }, [toggleOpen])

  const handleClose = useCallback(() => {
    setSelectedTask(null)
    toggleOpen()
  }, [toggleOpen])

  const handleEventClick = useCallback(
    ({ event }: { event: { id: string, extendedProps?: { originalTaskId?: string } } }) => {
      const taskId = event.extendedProps?.originalTaskId ?? event.id.split('-')[0]
      const task = schedule.find(v => v.taskId === taskId)
      if (!task) {
        return
      }
      handleTaskClick(task)
    },
    [schedule, handleTaskClick],
  )

  return { selectedTask, open, handleTaskClick, handleClose, handleEventClick }
}
