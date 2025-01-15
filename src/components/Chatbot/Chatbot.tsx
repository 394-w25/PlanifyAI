import { CustomDialog } from '@/components/common'
import SendIcon from '@mui/icons-material/Send'
import { Box, IconButton, TextField } from '@mui/material'
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

export const Chatbot = ({ open, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [messageId, setMessageId] = useState(1)

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [
      ...prev,
      { id: messageId, text, sender, timestamp: new Date() },
    ])
    setMessageId(prev => prev + 1)
  }

  const handleSend = () => {
    if (input.trim()) {
      addMessage(input, 'user')
      setInput('')

      // Simulate bot response
      setTimeout(() => {
        addMessage('This is a sample response from PlanifyAI', 'bot')
      }, 1000)
    }
  }

  const handleInputKeyDown = (event_: React.KeyboardEvent<HTMLDivElement>) => {
    if (event_.key === 'Enter') {
      event_.preventDefault()
      handleSend()
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
                  color: sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
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
              disabled={!input.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </CustomDialog>
  )
}
