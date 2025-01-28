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

interface TaskTimeRange {
  start: string
  end: string
}

interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly'
  interval: number
  endDate?: string
}

interface Task {
  taskId: string
  title: string
  description: string
  category: TaskCategory
  date: string
  timeRange?: TaskTimeRange
  priority: TaskPriority
  status: 'pending' | 'completed'
  isRecurring: boolean
  recurrencePattern: RecurrencePattern
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
