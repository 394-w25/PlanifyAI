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
  const [messages, dispatch] = useReducer(messageReducer, [])
  const [isLoading, setIsLoading] = useState(false)

  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
  const DEEPSEEK_API_KEY = import.meta.env.VITE_API_KEY as string

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
            messages: [{ role: 'user', content: input }],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        })

        if (!response.ok) {
          throw new Error('API Error')
        }

        const data = await response.json() as DeepSeekResponse
        const botMessage
          = data?.choices?.[0]?.message?.content ?? 'No response from the bot.'
        addMessage(botMessage, 'bot')
      }
      catch (error) {
        console.error('Error:', error)
        addMessage('An error occurred. Please try again later.', 'bot')
      }
      finally {
        setIsLoading(false)
      }
    },
    [addMessage, DEEPSEEK_API_URL, DEEPSEEK_API_KEY],
  )

  return { messages, handleSend, isLoading }
}

export default useChatbot
