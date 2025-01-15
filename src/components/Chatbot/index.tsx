import { CustomDialog } from '@/components/common'
import { useChatbot } from '@/hooks'
import { Box } from '@mui/material'
import MessageInput from './MessageInput'
import MessageList from './MessageList'

interface ChatbotProps {
  open: boolean
  onClose: () => void
}

const Chatbot = ({ open, onClose }: ChatbotProps) => {
  const { messages, handleSend, isLoading } = useChatbot()

  return (
    <CustomDialog open={open} onClose={onClose} title="PlanifyAI Chatbot" maxWidth="md" fullWidth>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 500 }}>
        <MessageList messages={messages} />
        <MessageInput onSend={handleSend} isLoading={isLoading} />
      </Box>
    </CustomDialog>
  )
}

export default Chatbot
