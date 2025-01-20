import SendIcon from '@mui/icons-material/Send'
import { Box, CircularProgress, IconButton, TextField } from '@mui/material'
import { useCallback, useState } from 'react'

interface MessageInputProps {
  onSend: (message: string) => Promise<void>
  isLoading: boolean
}

const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
  const [input, setInput] = useState('')

  const handleSendClick = useCallback(async () => {
    if (input.trim()) {
      await onSend(input.trim())
      setInput('')
    }
  }, [input, onSend])

  const handleInputKeyDown = useCallback(
    async (event_: React.KeyboardEvent<HTMLDivElement>) => {
      if (event_.key === 'Enter') {
        event_.preventDefault()
        await handleSendClick()
      }
    },
    [handleSendClick],
  )

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={event_ => setInput(event_.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <IconButton
          color="primary"
          onClick={handleSendClick}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}

export default MessageInput
