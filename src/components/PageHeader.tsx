import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { IconButton, Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  description: string
  showBack?: boolean
  showSettings?: boolean
}

export function PageHeader({ title, description, showBack = false, showSettings = false }: PageHeaderProps) {
  const intl = useIntl()
  const navigate = useNavigate()

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
      <Stack spacing={1} sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {showBack ? (
            <IconButton
              aria-label={intl.formatMessage({ id: 'common.back' })}
              color="primary"
              onClick={() => navigate(-1)}
              sx={{ alignSelf: 'flex-start' }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
          ) : null}
          <Typography component="h1" variant="h4" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
      {showSettings ? (
        <IconButton
          aria-label={intl.formatMessage({ id: 'settings.title' })}
          color="primary"
          onClick={() => navigate('/settings')}
        >
          <SettingsRoundedIcon />
        </IconButton>
      ) : null}
    </Stack>
  )
}
