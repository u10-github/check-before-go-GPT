import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import GavelRoundedIcon from '@mui/icons-material/GavelRounded'
import PrivacyTipRoundedIcon from '@mui/icons-material/PrivacyTipRounded'
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link as RouterLink } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useAppState } from '../context/AppStateContext'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import type { Language, ThemeMode } from '../types'

export function SettingsPage() {
  const intl = useIntl()
  const { settings, setLanguage, setThemeMode } = useAppState()
  const { canInstall, promptInstall } = useInstallPrompt()

  return (
    <Stack spacing={3}>
      <PageHeader
        title={intl.formatMessage({ id: 'settings.title' })}
        description={intl.formatMessage({ id: 'settings.description' })}
        showBack
      />

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              select
              label={intl.formatMessage({ id: 'settings.language' })}
              value={settings.language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              <MenuItem value="en">{intl.formatMessage({ id: 'language.en' })}</MenuItem>
              <MenuItem value="es">{intl.formatMessage({ id: 'language.es' })}</MenuItem>
              <MenuItem value="ja">{intl.formatMessage({ id: 'language.ja' })}</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label={intl.formatMessage({ id: 'settings.theme' })}
              value={settings.themeMode}
              onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
            >
              <MenuItem value="system">{intl.formatMessage({ id: 'theme.system' })}</MenuItem>
              <MenuItem value="light">{intl.formatMessage({ id: 'theme.light' })}</MenuItem>
              <MenuItem value="dark">{intl.formatMessage({ id: 'theme.dark' })}</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              <FormattedMessage id="settings.reorderTitle" />
            </Typography>
            <Typography color="text.secondary">
              <FormattedMessage id="settings.reorderDescription" />
            </Typography>
            <Button
              component={RouterLink}
              to="/reorder"
              variant="contained"
              startIcon={<FormatListNumberedRoundedIcon />}
            >
              <FormattedMessage id="settings.reorderButton" />
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              <FormattedMessage id="settings.installTitle" />
            </Typography>
            <Typography color="text.secondary">
              <FormattedMessage id="settings.installDescription" />
            </Typography>
            <Button
              variant="outlined"
              disabled={!canInstall}
              startIcon={<DownloadRoundedIcon />}
              onClick={() => {
                void promptInstall()
              }}
            >
              <FormattedMessage
                id={canInstall ? 'settings.installButton' : 'settings.installUnavailable'}
              />
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              <FormattedMessage id="settings.legalTitle" />
            </Typography>
            <Button
              component={RouterLink}
              to="/terms"
              variant="text"
              startIcon={<GavelRoundedIcon />}
              sx={{ justifyContent: 'flex-start' }}
            >
              <FormattedMessage id="settings.terms" />
            </Button>
            <Button
              component={RouterLink}
              to="/privacy"
              variant="text"
              startIcon={<PrivacyTipRoundedIcon />}
              sx={{ justifyContent: 'flex-start' }}
            >
              <FormattedMessage id="settings.privacy" />
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
