import { useScheduleStore } from '@/stores'
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL, SYSTEM_PROMPT } from '@/utils/chatbotConst'
import { auth } from '@/utils/firebase'
import { generateUniqueId } from '@zl-asica/react'
import { useCallback, useReducer, useState } from 'react'

interface MessageAction {
  type: 'add'
  payload: Message
}

const messageReducer = (state: Message[], action: MessageAction) => {
  switch (action.type) {
    case 'add':
      return [...state, action.payload]
    default:
      return state
  }
}

const useChatbot = () => {
  const addTask = useScheduleStore(state => state.addTask)
  const [chatbotError, setChatbotError] = useState<string | null>(null)

  const [messages, dispatch] = useReducer(messageReducer, [])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    dispatch({
      type: 'add',
      payload: {
        id: Date.now(),
        text,
        sender,
        timestamp: new Date(),
      },
    })
  }, [])

  const handleSend = useCallback(
    async (input: string) => {
      if (DEEPSEEK_API_KEY == null) {
        setIsLoading(false)
        setChatbotError('API key is missing.')
        setTimeout(() => setChatbotError(null), 3000)
        return
      }

      addMessage(input, 'user')
      setIsLoading(true)

      try {
        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: input }],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: {
              type: 'json_object',
            },
          }),
        })

        if (!response.ok) {
          throw new Error('API Error')
        }

        const data = await response.json() as DeepSeekResponse
        const botMessage = data?.choices?.[0]?.message?.content ?? 'No response from the bot.'

        const parsedMessage = JSON.parse(botMessage) as {
          title: string
          description: string
          category: TaskCategory
          date: string
          priority: TaskPriority
          comment: string
        }
        addMessage(parsedMessage.comment, 'bot')

        if (parsedMessage.title != null && auth.currentUser != null) {
          const randomId = await generateUniqueId([parsedMessage.title, parsedMessage.description, parsedMessage.category, parsedMessage.priority])
          const newTask = {
            taskId: randomId,
            title: parsedMessage.title,
            description: parsedMessage.description,
            category: parsedMessage.category,
            priority: parsedMessage.priority,
            date: parsedMessage.date,
            timeRange: {
              start: '00:00',
              end: '23:59',
            },
            status: 'pending' as const,
            isRecurring: false,
            recurrencePattern: null,
          }
          await addTask(newTask)
        }
      }
      catch (error_) {
        setChatbotError('An error occurred. Please try again later.')
        addMessage('An error occurred. Please try again later.', 'bot')
        console.error('Error occurred during chatbot request: ', error_)
      }
      finally {
        setIsLoading(false)
      }
    },
    [addMessage, addTask],
  )

  return { messages, handleSend, isLoading, chatbotError }
}

export default useChatbot
