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
        try {
          set({ loading: true })
          const tasks = await getSchedule(userId)
          set({ userId, schedule: tasks, error: null })
        }
        catch (error_) {
          console.error('Error fetching schedule:', error_)
          set({ error: 'Failed to load schedule.' })
        }
        finally {
          set({ loading: false })
        }
      },

      clearSchedule: () => {
        set({ userId: '', schedule: [], error: null })
      },

      updateTask: async (updatedTask) => {
        try {
          const userId = get().userId
          await updateTask(userId, updatedTask)
          set(state => ({
            schedule: state.schedule.map(task =>
              task.taskId === updatedTask.taskId ? updatedTask : task,
            ),
            error: null,
          }))
          toast.success(`Task "${updatedTask.title}" updated successfully!`)
        }
        catch (error_) {
          console.error('Error updating task:', error_)
          set({ error: 'Failed to update task.' })
          toast.error(`Failed to update task "${updatedTask.title}".`)
        }
      },

      addTask: async (newTask) => {
        try {
          const userId = get().userId
          await addTask(userId, newTask)
          set(state => ({
            schedule: [...state.schedule, newTask],
            error: null,
          }))
          toast.success(`Task "${newTask.title}" added successfully!`)
        }
        catch (error_) {
          console.error('Error adding task:', error_)
          set({ error: 'Failed to add task.' })
          toast.error(`Failed to add task "${newTask.title}".`)
        }
      },

      deleteTask: async (taskId) => {
        try {
          const userId = get().userId
          await deleteTask(userId, taskId)
          set(state => ({
            schedule: state.schedule.filter(task => task.taskId !== taskId),
            error: null,
          }))
          toast.success('Task deleted successfully!')
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
