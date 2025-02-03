type UserType = 'admin' | 'user'

interface UserProfile {
  uid: string
  name: string
  email: string
  profilePic: string
  createdAt: string
  role: UserType
}

type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other' | 'school' | 'holiday'

type TaskPriority = 'low' | 'medium' | 'high' | null

interface TaskTimeRange {
  start: string
  end: string
}

interface Task {
  taskId: string
  title: string
  description: string
  category: TaskCategory
  date: string
  timeRange?: TaskTimeRange | null
  priority: TaskPriority
  status: 'pending' | 'completed' | null
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
