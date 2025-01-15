interface DeepSeekError {
  error?: {
    message?: string
  }
}

interface DeepSeekMessage {
  role: string
  content: string
}

interface DeepSeekResponse {
  choices?: Array<{
    message?: DeepSeekMessage
  }>
}

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}
