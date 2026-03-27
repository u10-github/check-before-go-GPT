import { Box, CircularProgress, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { Suspense, lazy, useMemo } from 'react'
import { IntlProvider } from 'react-intl'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import { AppLayout } from './layout/AppLayout'
import { getMessages } from './messages'
import { createAppTheme } from './theme/theme'

const ChecklistPage = lazy(async () => {
  const module = await import('./pages/ChecklistPage')
  return { default: module.ChecklistPage }
})

const SettingsPage = lazy(async () => {
  const module = await import('./pages/SettingsPage')
  return { default: module.SettingsPage }
})

const ReorderPage = lazy(async () => {
  const module = await import('./pages/ReorderPage')
  return { default: module.ReorderPage }
})

const LegalPage = lazy(async () => {
  const module = await import('./pages/LegalPage')
  return { default: module.LegalPage }
})

function RouteLoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress />
    </Box>
  )
}

function AppContent() {
  const { settings } = useAppState()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const resolvedMode =
    settings.themeMode === 'system'
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : settings.themeMode

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode])
  const messages = useMemo(() => getMessages(settings.language), [settings.language])

  return (
    <IntlProvider locale={settings.language} defaultLocale="en" messages={messages}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<ChecklistPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="reorder" element={<ReorderPage />} />
                <Route path="terms" element={<LegalPage kind="terms" />} />
                <Route path="privacy" element={<LegalPage kind="privacy" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      </ThemeProvider>
    </IntlProvider>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  )
}
