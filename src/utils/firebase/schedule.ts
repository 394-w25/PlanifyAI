import { FirebaseError } from 'firebase/app'
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'

const getSchedule = async (userId: string): Promise<Task[]> => {
  try {
    const scheduleRef = doc(db, 'schedules', userId)
    const scheduleSnap = await getDoc(scheduleRef)

    if (scheduleSnap.exists()) {
      const data = scheduleSnap.data() as { tasks: Task[] }
      return Array.isArray(data.tasks) ? data.tasks : []
    }
    else {
      console.warn(`No schedule found for userId: ${userId}`)
      return []
    }
  }
  catch (error) {
    console.error('Error fetching schedule:', error)
    throw new Error('Failed to fetch schedule.')
  }
}

const updateTask = async (userId: string, updatedTask: Task): Promise<void> => {
  try {
    const scheduleRef = doc(db, 'schedules', userId)
    const scheduleSnap = await getDoc(scheduleRef)

    if (scheduleSnap.exists()) {
      const data = scheduleSnap.data() as { tasks: Task[] }
      const currentTasks = Array.isArray(data.tasks) ? data.tasks : []
      const updatedTasks = currentTasks.map((task: Task) =>
        task.taskId === updatedTask.taskId ? updatedTask : task,
      )

      await setDoc(scheduleRef, { tasks: updatedTasks }, { merge: true })
    }
    else {
      console.warn(`No schedule found for userId: ${userId}`)
    }
  }
  catch (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task.')
  }
}

const addTask = async (userId: string, newTask: Task): Promise<void> => {
  try {
    const scheduleRef = doc(db, 'schedules', userId)
    await updateDoc(scheduleRef, {
      tasks: arrayUnion(newTask),
    })
  }
  catch (error) {
    if (error instanceof FirebaseError && error.code === 'not-found') {
      await setDoc(doc(db, 'schedules', userId), {
        tasks: [newTask],
      })
    }
    else {
      console.error('Error adding task:', error)
      throw new Error('Failed to add task.')
    }
  }
}

const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  try {
    const scheduleRef = doc(db, 'schedules', userId)
    const scheduleSnap = await getDoc(scheduleRef)

    if (scheduleSnap.exists()) {
      const data = scheduleSnap.data() as { tasks: Task[] }
      const currentTasks = Array.isArray(data.tasks) ? data.tasks : []
      const updatedTasks = currentTasks.filter((task: Task) => task.taskId !== taskId)

      await setDoc(scheduleRef, { tasks: updatedTasks }, { merge: true })
    }
    else {
      console.warn(`No schedule found for userId: ${userId}`)
    }
  }
  catch (error) {
    console.error('Error deleting task:', error)
    throw new Error('Failed to delete task.')
  }
}

export { addTask, deleteTask, getSchedule, updateTask }
