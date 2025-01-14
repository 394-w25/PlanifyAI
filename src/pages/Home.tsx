import { Chatbot } from '@/components/Chatbot'
import { Calendar } from '@/components/Home'
import ChatIcon from '@mui/icons-material/Chat'
import { Box, Fab } from '@mui/material'
import { useState } from 'react'

const Home = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false)

  const handleChatbotOpen = () => {
    setChatbotOpen(true)
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Calendar />
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleChatbotOpen}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
      >
        <ChatIcon />
      </Fab>
      <Chatbot open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </Box>
  )
}

export default Home
