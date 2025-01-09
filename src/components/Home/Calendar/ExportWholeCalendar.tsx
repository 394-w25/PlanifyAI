import { useScheduleStore } from '@/stores'
import { generateCombinedICSFile } from '@/utils/generateICSFile'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button } from '@mui/material'

const ExportWholeCalendar = () => {
  const schedule = useScheduleStore(state => state.schedule)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <Button
        onClick={() => generateCombinedICSFile(schedule)}
        variant="contained"
        sx={{
          p: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FileDownloadIcon sx={{ marginRight: '0.5rem' }} />
        Export All to Calendar
      </Button>
    </Box>
  )
}

export default ExportWholeCalendar
