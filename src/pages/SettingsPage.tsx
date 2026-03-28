import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import GavelRoundedIcon from '@mui/icons-material/GavelRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import PrivacyTipRoundedIcon from '@mui/icons-material/PrivacyTipRounded'
import {
  Alert,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link as RouterLink } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PageSection } from '../components/PageSection'
import { useAppState } from '../context/AppStateContext'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { parsePersistedState, serializePersistedState } from '../lib/storage'
import type { PersistedState } from '../types'
import type { Language, ThemeMode } from '../types'

export function SettingsPage() {
  const intl = useIntl()
  const { consent, items, settings, lastResetAt, replaceState, setLanguage, setThemeMode } =
    useAppState()
  const { installState, promptInstall } = useInstallPrompt()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [importState, setImportState] = useState<PersistedState | null>(null)
  const [importFileName, setImportFileName] = useState<string | null>(null)
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const exportState = () => {
    const state: PersistedState = {
      version: 1,
      items,
      settings,
      lastResetAt,
      consent,
    }
    const blob = new Blob([serializePersistedState(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)

    link.href = url
    link.download = `checkbefore-backup-${date}.json`
    link.click()
    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 0)
  }

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    let content: string

    try {
      content = await file.text()
    } catch {
      setImportState(null)
      setImportFileName(null)
      setRestoreStatus('error')
      event.target.value = ''
      return
    }

    const parsed = parsePersistedState(content)

    if (parsed.status === 'error') {
      setImportState(null)
      setImportFileName(null)
      setRestoreStatus('error')
      event.target.value = ''
      return
    }

    setImportState(parsed.state)
    setImportFileName(file.name)
    setRestoreStatus('idle')
    event.target.value = ''
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}>
      <PageHeader
        title={intl.formatMessage({ id: 'settings.title' })}
        titleVariant="h5"
        showBack
        fallbackTo="/"
      />

      <PageSection>
        <Stack divider={<Divider flexItem />}>
          <Stack spacing={2} sx={{ p: 2.5 }}>
            <TextField
              fullWidth
              select
              variant="standard"
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
              variant="standard"
              label={intl.formatMessage({ id: 'settings.theme' })}
              value={settings.themeMode}
              onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
            >
              <MenuItem value="system">{intl.formatMessage({ id: 'theme.system' })}</MenuItem>
              <MenuItem value="light">{intl.formatMessage({ id: 'theme.light' })}</MenuItem>
              <MenuItem value="dark">{intl.formatMessage({ id: 'theme.dark' })}</MenuItem>
            </TextField>
          </Stack>

          <Stack spacing={1.5} sx={{ p: 2.5 }}>
            <Typography fontWeight={600}>
              <FormattedMessage id="settings.reorderTitle" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="settings.reorderDescription" />
            </Typography>
            <Button
              component={RouterLink}
              to="/reorder"
              variant="text"
              startIcon={<FormatListNumberedRoundedIcon />}
              sx={{ alignSelf: 'flex-start', px: 0 }}
            >
              <FormattedMessage id="settings.reorderButton" />
            </Button>
          </Stack>

          <Stack spacing={1.5} sx={{ p: 2.5 }}>
            <Typography fontWeight={600}>
              <FormattedMessage id="settings.installTitle" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id={
                  installState === 'installed'
                    ? 'settings.installInstalledDescription'
                    : installState === 'prompt'
                      ? 'settings.installPromptDescription'
                      : 'settings.installManualDescription'
                }
              />
            </Typography>
            {installState === 'prompt' ? (
              <Button
                variant="text"
                startIcon={<DownloadRoundedIcon />}
                sx={{ alignSelf: 'flex-start', px: 0 }}
                onClick={() => {
                  void promptInstall()
                }}
              >
                <FormattedMessage id="settings.installButton" />
              </Button>
            ) : null}
            {installState === 'manual' ? (
              <Alert severity="info" variant="outlined">
                <FormattedMessage id="settings.installManualHelp" />
              </Alert>
            ) : null}
            {installState === 'installed' ? (
              <Alert severity="success" variant="outlined">
                <FormattedMessage id="settings.installInstalled" />
              </Alert>
            ) : null}
          </Stack>

          <Stack spacing={1.5} sx={{ p: 2.5 }}>
            <Typography fontWeight={600}>
              <FormattedMessage id="settings.legalTitle" />
            </Typography>
            <Button
              component={RouterLink}
              to="/terms"
              variant="text"
              startIcon={<GavelRoundedIcon />}
              sx={{ justifyContent: 'flex-start', px: 0 }}
            >
              <FormattedMessage id="settings.terms" />
            </Button>
            <Button
              component={RouterLink}
              to="/privacy"
              variant="text"
              startIcon={<PrivacyTipRoundedIcon />}
              sx={{ justifyContent: 'flex-start', px: 0 }}
            >
              <FormattedMessage id="settings.privacy" />
            </Button>
          </Stack>
        </Stack>
      </PageSection>

      <PageSection tone="subtle">
        <Stack spacing={2}>
          <Typography fontWeight={600}>
            <FormattedMessage id="settings.backupTitle" />
          </Typography>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage id="settings.backupDescription" />
        </Typography>
        {restoreStatus === 'success' ? (
          <Alert severity="success">
            <FormattedMessage id="settings.restoreSuccess" />
          </Alert>
        ) : null}
        {restoreStatus === 'error' ? (
          <Alert severity="error">
            <FormattedMessage id="settings.restoreError" />
          </Alert>
        ) : null}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={exportState}>
            <FormattedMessage id="settings.backupButton" />
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadFileRoundedIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            <FormattedMessage id="settings.restoreButton" />
          </Button>
        </Stack>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          aria-label={intl.formatMessage({ id: 'settings.restoreInput' })}
          onChange={(event) => {
            void handleImportChange(event)
          }}
        />
        </Stack>
      </PageSection>

      <Dialog open={importState !== null} onClose={() => setImportState(null)}>
        <DialogTitle>
          <FormattedMessage id="settings.restoreConfirmTitle" />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage
            id="settings.restoreConfirmDescription"
            values={{ fileName: importFileName ?? intl.formatMessage({ id: 'app.title' }) }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setImportState(null)
              setImportFileName(null)
            }}
          >
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!importState) {
                return
              }

              replaceState(importState)
              setImportState(null)
              setImportFileName(null)
              setRestoreStatus('success')
            }}
          >
            <FormattedMessage id="settings.restoreConfirmButton" />
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
