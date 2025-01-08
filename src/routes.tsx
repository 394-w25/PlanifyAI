import { Layout, LoadingCircle, ProtectedRoute } from '@/components/common'
import Home from '@/pages/Home'
import { Box } from '@mui/material'

import { Route, Routes } from 'react-router-dom'
import { useUserStore } from './stores'

const AppRoutes = () => {
  const routeConfig = [
    { path: '/user', element: <Home /> },
  ]

  const loading = useUserStore(state => state.loading)

  if (loading) {
    return <LoadingCircle />
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route
          index
          element={<Home />}
        />
        {routeConfig.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute element={element} />}
          />
        ))}
        {/* 404 Page */}
        <Route
          path="*"
          element={(
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                mt: 10,
              }}
            >
              <h1>404</h1>
              <p>Oops! The page you're looking for doesn't exist.</p>
            </Box>
          )}
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
