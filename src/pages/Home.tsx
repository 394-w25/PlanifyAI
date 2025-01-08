import { Calendar } from '@/components/Home'
import { Box } from '@mui/material'

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <Calendar />
    </Box>
  )
}

export default Home
