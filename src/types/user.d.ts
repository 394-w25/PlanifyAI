type UserType = 'admin' | 'user'

interface UserProfile {
  uid: string
  name: string
  email: string
  profilePic: string
  createdAt: string
  role: UserType
}

type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other' | 'school'

type TaskPriority = 'low' | 'medium' | 'high'

interface Task {
  taskId: string
  title: string
  description: string
  category: TaskCategory
  date: string
  priority: TaskPriority
  status: 'pending' | 'completed'
}

type Schedule = Task[]

interface AutoScheduleInput {
  userId: string
  tasks: Task[]
  date: string
}

interface AutoScheduleOutput {
  schedule: Task[]
  summary: string
}
