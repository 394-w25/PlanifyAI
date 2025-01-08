import { ConfirmationDialog } from '@/components/common'
import { useUserStore } from '@/stores'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'

import { useToggle } from '@zl-asica/react'

import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const user = useUserStore(state => state.user)
  const login = useUserStore(state => state.login)
  const logout = useUserStore(state => state.logout)

  const location = useLocation()
  const navigate = useNavigate()

  // Dialog visibility state
  const [confirmDialogOpen, toggleConfirmDialog] = useToggle()

  // Pages where the back button should not be shown
  const routesWithoutBackButton = ['/', '/user']
  const showBackButton = !routesWithoutBackButton.includes(location.pathname)

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'primary.light',
        color: '#000',
        borderRadius: '0 0 8px 8px',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>
        {/* Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={async () => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        </Box>

        {/* App Title */}
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 600,
            fontSize: '1.4rem',
          }}
        >
          Planify AI
        </Typography>

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user
            ? (
                <>
                  {/* User Avatar */}
                  <IconButton edge="end" color="inherit" onClick={toggleConfirmDialog}>
                    <Avatar alt={`${user.name}'s profile picture`} src={user.profilePic}>
                      {user.name
                        ?.split(' ')
                        .slice(0, 2)
                        .map((word: string) => word[0])
                        .join('') || 'U'}
                    </Avatar>
                  </IconButton>

                  {/* Sign-Out Confirmation Dialog */}
                  <ConfirmationDialog
                    open={confirmDialogOpen}
                    onClose={toggleConfirmDialog}
                    onConfirm={async () => {
                      await logout(navigate)
                      toggleConfirmDialog()
                    }}
                    title="Sign Out"
                    description="Are you sure you want to sign out?"
                  />
                </>
              )
            : (
                // Sign-In Button
                <Button
                  color="inherit"
                  onClick={async () => {
                    await login(navigate)
                  }}
                >
                  Sign In
                </Button>
              )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
