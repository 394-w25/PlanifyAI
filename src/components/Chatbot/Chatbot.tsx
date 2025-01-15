import { CustomDialog } from '@/components/common'
import SendIcon from '@mui/icons-material/Send'
import { Box, CircularProgress, IconButton, TextField } from '@mui/material'
import { useState } from 'react'

interface ChatbotProps {
  open: boolean
  onClose: () => void
}

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

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

export const Chatbot = ({ open, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageId, setMessageId] = useState(1)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
  const DEEPSEEK_API_KEY = 'API_KEY'

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [
      ...prev,
      { id: messageId, text, sender, timestamp: new Date() },
    ])
    setMessageId(prev => prev + 1)
  }

  const handleSend = async () => {
    if (input.trim()) {
      addMessage(input, 'user')
      setInput('')
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
            messages: [
              {
                role: 'user',
                content: input,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        })

        if (!response.ok) {
          const errorData: DeepSeekError = (await response.json()) as DeepSeekError

          let errorMessage = 'Unknown error'
          if (errorData.error && typeof errorData.error.message === 'string') {
            const trimmedMessage = errorData.error.message.trim()
            if (trimmedMessage.length > 0) {
              errorMessage = trimmedMessage
            }
          }

          throw new Error(`API Error: ${errorMessage}`)
        }

        const data: DeepSeekResponse = (await response.json()) as DeepSeekResponse
        const botMessage = data?.choices?.[0]?.message?.content ?? 'No response from the bot.'
        addMessage(botMessage, 'bot')
      }
      catch (error) {
        console.error('Error:', error)
        addMessage('An error occurred. Please try again later.', 'bot')
      }
      finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputKeyDown = async (event_: React.KeyboardEvent<HTMLDivElement>) => {
    if (event_.key === 'Enter') {
      event_.preventDefault()
      await handleSend()
    }
  }

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="PlanifyAI Chatbot"
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 500 }}>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map(({ id, text, sender, timestamp }) => (
            <Box
              key={id}
              sx={{
                alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                p: 2,
                borderRadius: 2,
                bgcolor: sender === 'user' ? 'primary.main' : 'grey.200',
                color: sender === 'user' ? 'common.white' : 'text.primary',
              }}
            >
              <Box>{text}</Box>
              <Box
                sx={{
                  fontSize: '0.75rem',
                  color:
                    sender === 'user'
                      ? 'rgba(255,255,255,0.7)'
                      : 'text.secondary',
                  mt: 0.5,
                  textAlign: 'right',
                }}
              >
                {timestamp.toLocaleTimeString()}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </CustomDialog>
  )
}
