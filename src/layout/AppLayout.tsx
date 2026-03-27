import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  )
}
