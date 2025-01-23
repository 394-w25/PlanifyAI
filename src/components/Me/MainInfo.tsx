import { Avatar, Box, TextField, Typography } from '@mui/material'

interface MainInfoProps {
  editing: boolean
  displayName: string
  email: string
  userData: UserProfile | null
  onChangeDisplayName: (value: string) => void
  onChangeEmail: (value: string) => void
}

const MainInfo = ({
  editing,
  displayName,
  email,
  userData,
  onChangeDisplayName,
  onChangeEmail,
}: MainInfoProps) => {
  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
      }}
    >
      <Box display="flex" justifyContent="center" mb={3}>
        <Avatar
          src={userData?.profilePic ?? ''}
          alt={displayName}
          sx={{ width: 120, height: 120 }}
        />
      </Box>
      {editing
        ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                label="Display Name"
                value={displayName}
                onChange={event_ => onChangeDisplayName(event_.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Email"
                value={email}
                onChange={event_ => onChangeEmail(event_.target.value)}
                fullWidth
                variant="outlined"
              />
            </Box>
          )
        : (
            <Box
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {displayName || 'NA'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData?.email ?? 'NA'}
              </Typography>
            </Box>
          )}
    </Box>
  )
}

export default MainInfo
