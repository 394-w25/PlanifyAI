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

  const SYSTEM_PROMPT = [
    'The user will describe a calendar event. Please try to understand the context, turn it into JSON and output in JSON format.',
    'If the user input does not make sense as an event, ask the user to try again in the "comment" key',
    '"category" can be "Work", "Personal", "Health", "Learning", "Other" or "School"',
    '"priority" can be "Low", "Medium" or "High"',
    'Today is 2025.01.22 Wed',
    '',
    'EXAMPLE INPUT 1:',
    'I have an important meeting with the board on Friday',
    '',
    'EXAMPLE JSON OUTPUT 1:',
    '{',
    '    "title": "Meeting"',
    '    "description": "An important meeting with the board."',
    '    "category": "Work"',
    '    "priority": "High"',
    '    "date": "2025.01.24"',
    '    "comment": "I suggest schedueling a high-priority event called Meeting on 2025.01.24."',
    '}',
    'EXAMPLE INPUT 2:',
    'What a nice day!',
    '',
    'EXAMPLE JSON OUTPUT 2:',
    '{',
    '    "title": null',
    '    "description": null',
    '    "category": null',
    '    "priority": null',
    '    "date": null',
    '    "comment": "Sorry, this does not look like a calendar event, please try again.',
    '}',
  ].join('\n')

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
        const botMessage
          = data?.choices?.[0]?.message?.content ?? 'No response from the bot.'
        const parsedMessage = JSON.parse(botMessage) as { comment: string }
        addMessage(parsedMessage.comment, 'bot')
      }
      catch (error) {
        console.error('Error:', error)
        addMessage('An error occurred. Please try again later.', 'bot')
      }
      finally {
        setIsLoading(false)
      }
    },
    [addMessage, DEEPSEEK_API_URL, DEEPSEEK_API_KEY, SYSTEM_PROMPT],
  )

  return { messages, handleSend, isLoading }
}

export default useChatbot
