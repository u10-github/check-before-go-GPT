import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { useMemo } from 'react'
import { IntlProvider } from 'react-intl'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import { AppLayout } from './layout/AppLayout'
import { getMessages } from './messages'
import { ChecklistPage } from './pages/ChecklistPage'
import { LegalPage } from './pages/LegalPage'
import { ReorderPage } from './pages/ReorderPage'
import { SettingsPage } from './pages/SettingsPage'
import { createAppTheme } from './theme/theme'

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
