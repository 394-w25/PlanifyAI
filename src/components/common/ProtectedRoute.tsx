import type { ReactElement } from 'react'
import LoadingCircle from '@/components/common/LoadingCircle'

import { useUserStore } from '@/stores'

import { Typography } from '@mui/material'

interface ProtectedRouteProps {
  element: ReactElement
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const user = useUserStore(state => state.user)
  const loading = useUserStore(state => state.loading)

  if (loading) {
    return <LoadingCircle />
  }

  if (!user) {
    return (
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          marginTop: '2rem',
        }}
      >
        Please sign in to view this page
      </Typography>
    )
  }

  return element
}

export default ProtectedRoute
