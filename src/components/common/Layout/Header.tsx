import type { MouseEvent } from 'react'
import { ConfirmationDialog } from '@/components/common'
import { useUserStore } from '@/stores'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import { useToggle } from '@zl-asica/react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const user = useUserStore(state => state.user)
  const login = useUserStore(state => state.login)
  const logout = useUserStore(state => state.logout)
  const location = useLocation()
  const navigate = useNavigate()

  const [confirmDialogOpen, toggleConfirmDialog] = useToggle()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user
            ? (
                <>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClick}
                    aria-controls={open ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar alt={`${user.name}'s profile picture`} src={user.profilePic}>
                      {user.name
                        ?.split(' ')
                        .slice(0, 2)
                        .map(word => word[0])
                        .join('') || 'U'}
                    </Avatar>
                  </IconButton>

                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        'overflow': 'visible',
                        'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        'mt': 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={async () => navigate('/user')}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Profile</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={toggleConfirmDialog}
                      sx={{ color: 'error.main' }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText>Sign out</ListItemText>
                    </MenuItem>
                  </Menu>

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
