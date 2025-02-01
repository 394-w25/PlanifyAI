import { getOrCreateDocument, updateDocument } from './firebaseUtils'

const getSchedule = async (userId: string): Promise<Task[]> => {
  const defaultTasks: Task[] = []
  return (await getOrCreateDocument(userId, 'schedules', { tasks: defaultTasks }))?.tasks ?? []
}

const updateTask = async (userId: string, updatedTask: Task): Promise<void> => {
  try {
    const userTasks = await getSchedule(userId)
    const updatedTasks = userTasks.map(task =>
      task.taskId === updatedTask.taskId ? updatedTask : task,
    )

    await updateDocument(userId, 'schedules', { tasks: updatedTasks })
  }
  catch (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task.')
  }
}

const addTask = async (userId: string, newTask: Task): Promise<void> => {
  try {
    const userTasks = await getSchedule(userId)
    const updatedTasks = [...userTasks, newTask]

    await updateDocument(userId, 'schedules', { tasks: updatedTasks })
  }
  catch (error) {
    console.error('Error adding task:', error)
    throw new Error('Failed to add task.')
  }
}

const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  try {
    const userTasks = await getSchedule(userId)
    const updatedTasks = userTasks.filter(task => task.taskId !== taskId)

    await updateDocument(userId, 'schedules', { tasks: updatedTasks })
  }
  catch (error) {
    console.error('Error deleting task:', error)
    throw new Error('Failed to delete task.')
  }
}

export { addTask, deleteTask, getSchedule, updateTask }
