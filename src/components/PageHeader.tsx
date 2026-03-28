import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { IconButton, Stack, Typography } from '@mui/material'
import type { TypographyProps } from '@mui/material'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  description?: string
  titleVariant?: TypographyProps['variant']
  showBack?: boolean
  fallbackTo?: string
  showSettings?: boolean
}

export function PageHeader({
  title,
  description,
  titleVariant = 'h4',
  showBack = false,
  fallbackTo = '/',
  showSettings = false,
}: PageHeaderProps) {
  const intl = useIntl()
  const navigate = useNavigate()
  const canNavigateBack =
    typeof window !== 'undefined' &&
    typeof window.history.state === 'object' &&
    window.history.state !== null &&
    'idx' in window.history.state &&
    typeof window.history.state.idx === 'number' &&
    window.history.state.idx > 0

  const handleBackClick = () => {
    if (canNavigateBack) {
      navigate(-1)
      return
    }

    navigate(fallbackTo, { replace: true })
  }

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
      <Stack spacing={1} sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {showBack ? (
            <IconButton
              aria-label={intl.formatMessage({ id: 'common.back' })}
              color="primary"
              onClick={handleBackClick}
              sx={{ alignSelf: 'flex-start' }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
          ) : null}
          <Typography component="h1" variant={titleVariant} fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        {description ? <Typography color="text.secondary">{description}</Typography> : null}
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
