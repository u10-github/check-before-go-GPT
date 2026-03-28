import GavelRoundedIcon from '@mui/icons-material/GavelRounded'
import PrivacyTipRoundedIcon from '@mui/icons-material/PrivacyTipRounded'
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { PageSection } from '../components/PageSection'
import { useAppState } from '../context/AppStateContext'

export function ConsentPage() {
  const intl = useIntl()
  const navigate = useNavigate()
  const { acceptConsent } = useAppState()
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 720, mx: 'auto', py: { xs: 1, sm: 2 } }}>
      <Stack spacing={1.5}>
        <Typography component="h1" variant="h4" fontWeight={700}>
          <FormattedMessage id="consent.title" />
        </Typography>
        <Typography color="text.secondary">
          <FormattedMessage id="consent.description" />
        </Typography>
      </Stack>

      <PageSection sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={700}>
            <FormattedMessage id="consent.storageTitle" />
          </Typography>
          <Typography color="text.secondary">
            <FormattedMessage id="consent.storageBody" />
          </Typography>
        </Stack>
      </PageSection>

      <PageSection sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={700}>
            <FormattedMessage id="consent.legalTitle" />
          </Typography>
          <Typography color="text.secondary">
            <FormattedMessage id="consent.legalDescription" />
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              component={RouterLink}
              to="/terms"
              state={{ fromConsent: true }}
              variant="outlined"
              startIcon={<GavelRoundedIcon />}
            >
              <FormattedMessage id="consent.reviewTerms" />
            </Button>
            <Button
              component={RouterLink}
              to="/privacy"
              state={{ fromConsent: true }}
              variant="outlined"
              startIcon={<PrivacyTipRoundedIcon />}
            >
              <FormattedMessage id="consent.reviewPrivacy" />
            </Button>
          </Stack>
        </Stack>
      </PageSection>

      <PageSection tone="subtle">
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Checkbox checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            }
            label={intl.formatMessage({ id: 'consent.checkbox' })}
            sx={{ alignItems: 'flex-start', m: 0 }}
          />
          <Button
            variant="contained"
            size="large"
            disabled={!confirmed}
            onClick={() => {
              acceptConsent()
              navigate('/', { replace: true })
            }}
          >
            <FormattedMessage id="consent.start" />
          </Button>
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage id="consent.declineNote" />
          </Typography>
        </Stack>
      </PageSection>
    </Stack>
  )
}
