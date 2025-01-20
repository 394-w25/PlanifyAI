import { Box } from '@mui/material'
import { memo, useEffect, useRef } from 'react'

const MessageList = memo(({ messages }: { messages: Message[] }) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
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
      {messages.map(({ id, text, sender, timestamp }, index) => (
        <Box
          key={id}
          ref={index === messages.length - 1 ? lastMessageRef : null}
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
  )
})

export default MessageList
