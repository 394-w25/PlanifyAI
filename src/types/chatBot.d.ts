interface DeepSeekError {
  error?: {
    message?: string
  }
}

interface DeepSeekMessage {
  role: string
  content: string | Record<string, unknown>
}

interface DeepSeekResponse {
  choices?: Array<{
    message?: DeepSeekMessage
  }>
}

interface MessageAction {
  type: 'add'
  payload: Message
}

interface ChatbotState {
  isLoading: boolean
  chatbotError: string | null
}

type ChatbotAction =
  | { type: 'setLoading', payload: boolean }
  | { type: 'setError', payload: string | null }

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}
