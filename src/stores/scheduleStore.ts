import { addTask, deleteTask, getSchedule, updateTask } from '@/utils/firebase'
import { toast } from 'sonner'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ScheduleState {
  userId: string
  schedule: Schedule
  loading: boolean
  error: string | null
  fetchSchedule: (userId: string) => Promise<void>
  clearSchedule: () => void
  updateTask: (updatedTask: Task) => Promise<void>
  addTask: (newTask: Task) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}

const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      userId: '',
      schedule: [],
      loading: false,
      error: null,

      fetchSchedule: async (userId) => {
        if (!userId) {
          console.warn('fetchSchedule called without a valid userId.')
          return
        }

        try {
          set({ loading: true, error: null })
          const tasks = await getSchedule(userId)
          set({ userId, schedule: tasks })
        }
        catch (error_) {
          console.error('Error fetching schedule:', error_)
          set({ error: 'Failed to load schedule.' })
          toast.error('Failed to load schedule.')
        }
        finally {
          set({ loading: false })
        }
      },

      clearSchedule: () => {
        set({ userId: '', schedule: [], error: null })
      },

      updateTask: async (updatedTask) => {
        const userId = get().userId
        if (!userId) {
          console.warn('updateTask called without a valid userId.')
          return
        }

        try {
          await updateTask(userId, updatedTask)

          set(state => ({
            schedule: state.schedule.map(task =>
              task.taskId === updatedTask.taskId ? updatedTask : task,
            ),
          }))

          toast.success(`Task updated: "${updatedTask.title}"`)
        }
        catch (error_) {
          console.error('Error updating task:', error_)
          set({ error: 'Failed to update task.' })
          toast.error(`Failed to update: "${updatedTask.title}".`)
        }
      },

      addTask: async (newTask) => {
        const userId = get().userId
        if (!userId) {
          console.warn('addTask called without a valid userId.')
          return
        }

        try {
          await addTask(userId, newTask)

          set(state => ({
            schedule: [...state.schedule, newTask],
          }))

          toast.success(`Task added: "${newTask.title}"`)
        }
        catch (error_) {
          console.error('Error adding task:', error_)
          set({ error: 'Failed to add task.' })
          toast.error(`Failed to add: "${newTask.title}".`)
        }
      },

      deleteTask: async (taskId) => {
        const userId = get().userId
        if (!userId) {
          console.warn('deleteTask called without a valid userId.')
          return
        }

        try {
          await deleteTask(taskId, userId)

          set(state => ({
            schedule: state.schedule.filter(task => task.taskId !== taskId),
          }))

          toast.success('Task deleted.')
        }
        catch (error_) {
          console.error('Error deleting task:', error_)
          set({ error: 'Failed to delete task.' })
          toast.error('Failed to delete task.')
        }
      },
    }),
    { name: 'schedule-store' },
  ),
)

export default useScheduleStore
