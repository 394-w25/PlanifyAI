type UserType = 'admin' | 'user'

interface UserProfile {
  uid: string
  name: string
  email: string
  profilePic: string
  createdAt: string
  role: UserType
}

interface Task {
  taskId: string
  date: string
  title: string
  description: string
}
