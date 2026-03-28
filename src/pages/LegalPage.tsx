import { Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PageSection } from '../components/PageSection'
import { useAppState } from '../context/AppStateContext'

interface LegalPageProps {
  kind: 'terms' | 'privacy'
}

export function LegalPage({ kind }: LegalPageProps) {
  const intl = useIntl()
  const location = useLocation()
  const { hasAcceptedCurrentConsent } = useAppState()
  const prefix = `legal.${kind}`
  const openedFromConsent =
    typeof location.state === 'object' &&
    location.state !== null &&
    'fromConsent' in location.state &&
    location.state.fromConsent === true

  const sections = [1, 2, 3].map((section) => ({
    title: intl.formatMessage({ id: `${prefix}.section${section}Title` }),
    body: intl.formatMessage({ id: `${prefix}.section${section}Body` }),
  }))
  const fallbackTo = openedFromConsent || !hasAcceptedCurrentConsent ? '/consent' : '/settings'

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}>
      <PageHeader
        title={intl.formatMessage({ id: `${prefix}.title` })}
        description={intl.formatMessage({ id: 'legal.updated' })}
        showBack
        fallbackTo={fallbackTo}
      />

      <PageSection sx={{ p: 2.5 }}>
        <Stack spacing={3}>
          {sections.map((section) => (
            <Stack spacing={1} key={section.title}>
              <Typography variant="h6" fontWeight={700}>
                {section.title}
              </Typography>
              <Typography color="text.secondary">{section.body}</Typography>
            </Stack>
          ))}
        </Stack>
      </PageSection>
    </Stack>
  )
}
