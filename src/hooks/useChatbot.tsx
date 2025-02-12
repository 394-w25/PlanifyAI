import TaskAdditionConfirmationDialog from '@/components/Chatbot/TaskAdditionConfirmationDialog'
import { useScheduleStore } from '@/stores'
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL, SYSTEM_PROMPT } from '@/utils/chatbotConst'
import { auth } from '@/utils/firebase'
import { generateUniqueId } from '@zl-asica/react'
import { useCallback, useReducer, useState } from 'react'
import { z } from 'zod'

const chatbotResponseContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(['work', 'personal', 'health', 'learning', 'other', 'school']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected yyyy-mm-dd'),
  timeRange: z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Expected hh:mm'),
    end: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Expected hh:mm'),
  }).nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  comment: z.string(),
})

const chatbotResponseSchema = z.object({
  choices: z.array(z.object({
    message: z.object({
      content: chatbotResponseContentSchema,
    }),
  })),
})

const messageReducer = (state: Message[], action: MessageAction) => {
  if (action.type === 'add') {
    return [...state, action.payload]
  }
  return state
}

const chatbotReducer = (state: ChatbotState, action: ChatbotAction) => {
  switch (action.type) {
    case 'setLoading':
      return { ...state, isLoading: action.payload }
    case 'setError':
      return { ...state, chatbotError: action.payload }
    default:
      return state
  }
}

const useChatbot = () => {
  const addTask = useScheduleStore(state => state.addTask)
  const [messages, dispatchMessage] = useReducer(messageReducer, [])
  const [state, dispatchChatbot] = useReducer(chatbotReducer, { isLoading: false, chatbotError: null })
  const [pendingTask, setPendingTask] = useState<Task | null>(null)
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    dispatchMessage({
      type: 'add',
      payload: {
        id: Date.now(),
        text,
        sender,
        timestamp: new Date(),
      },
    })
  }, [])

  const confirmAddTask = async () => {
    if (pendingTask) {
      await addTask(pendingTask)
      setPendingTask(null)
    }
    setConfirmationOpen(false)
  }

  const handleSend = useCallback(
    async (input: string) => {
      if (!DEEPSEEK_API_KEY) {
        dispatchChatbot({ type: 'setError', payload: 'API key is missing.' })
        setTimeout(() => dispatchChatbot({ type: 'setError', payload: null }), 3000)
        return
      }

      addMessage(input, 'user')
      dispatchChatbot({ type: 'setLoading', payload: true })

      try {
        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: input },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: 'json_object' },
            schema: chatbotResponseContentSchema.shape,
          }),
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json() as DeepSeekResponse
        const normalizedData: DeepSeekResponse = {
          ...data,
          choices: data.choices?.map(choice => ({
            ...choice,
            message: choice.message
              ? {
                  ...choice.message,
                  content:
                    typeof choice.message.content === 'string'
                      ? JSON.parse(choice.message.content) as z.infer<typeof chatbotResponseContentSchema>
                      : choice.message.content,
                }
              : undefined,
          })),
        }

        let parsedData = chatbotResponseSchema.safeParse(normalizedData)

        if (!parsedData.success) {
          const errorCategory = parsedData.error.errors.find(err => err.path.includes('category'))
          const errorPriority = parsedData.error.errors.find(err => err.path.includes('priority'))

          if (normalizedData !== undefined && Array.isArray(normalizedData.choices) && normalizedData.choices[0].message?.content instanceof Object) {
            // category fallback
            if (errorCategory) {
              console.warn('Invalid category received. Defaulting to "other".')
              normalizedData.choices[0].message.content.category = 'other'
            }
            // priority fallback
            if (errorPriority) {
              console.warn('Invalid priority received. Defaulting to "low".')
              normalizedData.choices[0].message.content.priority = 'low'
            }

            parsedData = chatbotResponseSchema.safeParse(normalizedData)
          }
          else {
            console.error('Invalid response format:', parsedData.error.errors)
            console.error('Response data:', data)
            throw new Error('Invalid response format')
          }
        }

        if (parsedData.data === undefined) {
          throw new Error('Parsed data is undefined')
        }

        const botMessage = parsedData.data.choices[0].message.content
        addMessage(botMessage.comment, 'bot')

        if (botMessage.title && auth.currentUser) {
          const randomId = await generateUniqueId([
            botMessage.title,
            botMessage.description,
            botMessage.category,
            botMessage.priority,
          ])
          const newTask: Task = {
            taskId: randomId,
            title: botMessage.title,
            description: botMessage.description,
            category: botMessage.category,
            priority: botMessage.priority,
            date: botMessage.date,
            timeRange: botMessage.timeRange,
            status: 'completed',
            isRecurring: false,
            recurrencePattern: null,
          }

          // Store the task in the state and open the confirmation dialog
          setPendingTask(newTask)
          setConfirmationOpen(true)
        }
      }
      catch (error_) {
        const errorMessage = error_ instanceof Error ? error_.message : 'An unexpected error occurred.'
        dispatchChatbot({ type: 'setError', payload: errorMessage })
        addMessage('An error occurred. Please try again later.', 'bot')
        console.error('Chatbot error:', error_)
      }
      finally {
        dispatchChatbot({ type: 'setLoading', payload: false })
      }
    },
    [addMessage, setPendingTask, setConfirmationOpen],
  )

  return {
    messages,
    handleSend,
    isLoading: state.isLoading,
    chatbotError: state.chatbotError,
    confirmationDialog: (
      <TaskAdditionConfirmationDialog
        confirmationOpen={confirmationOpen}
        setConfirmationOpen={setConfirmationOpen}
        pendingTask={pendingTask}
        confirmAddTask={confirmAddTask}
      />
    ),
  }
}

export default useChatbot
