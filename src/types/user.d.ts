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
  timeRange?: TaskTimeRange | null
  priority: TaskPriority
  status: 'pending' | 'completed'
  isRecurring: boolean
  recurrencePattern: RecurrencePattern | null
}

type TaskAction =
  | { type: 'SET_FIELD', field: keyof Task, value: Task[keyof Task] }
  | { type: 'RESET', selectedDate: string, currentTask?: Task | null }

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
