import Chatbot from '@/components/Chatbot'
import { Calendar } from '@/components/Home'
import ChatIcon from '@mui/icons-material/Chat'
import { Box, Fab } from '@mui/material'
import { useToggle } from '@zl-asica/react'

const Home = () => {
  const [chatbotOpen, ToggleChatbotOpen] = useToggle()

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
        onClick={ToggleChatbotOpen}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 32,
        }}
      >
        <ChatIcon />
      </Fab>
      <Chatbot open={chatbotOpen} onClose={ToggleChatbotOpen} />
    </Box>
  )
}

export default Home
