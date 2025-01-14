import SendIcon from '@mui/icons-material/Send'
import { Box, IconButton, TextField } from '@mui/material'
import { useState } from 'react'
import CustomDialog from '../common/CustomDialog'

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

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInput('')

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: 'This is a sample response from PlanifyAI',
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botResponse])
      }, 1000)
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        >
          {messages.map(message => (
            <Box
              key={message.id}
              sx={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                p: 2,
                borderRadius: 2,
                bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.200',
                color: message.sender === 'user' ? 'common.white' : 'text.primary',
              }}
            >
              <Box>{message.text}</Box>
              <Box sx={{
                fontSize: '0.75rem',
                color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                mt: 0.5,
                textAlign: 'right',
              }}
              >
                {message.timestamp.toLocaleTimeString()}
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
              onKeyPress={e => e.key === 'Enter' && handleSend()}
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
