import { Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { PageHeader } from '../components/PageHeader'
import { PageSection } from '../components/PageSection'

interface LegalPageProps {
  kind: 'terms' | 'privacy'
}

export function LegalPage({ kind }: LegalPageProps) {
  const intl = useIntl()
  const prefix = `legal.${kind}`

  const sections = [1, 2, 3].map((section) => ({
    title: intl.formatMessage({ id: `${prefix}.section${section}Title` }),
    body: intl.formatMessage({ id: `${prefix}.section${section}Body` }),
  }))

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}>
      <PageHeader
        title={intl.formatMessage({ id: `${prefix}.title` })}
        description={intl.formatMessage({ id: 'legal.updated' })}
        showBack
        fallbackTo="/settings"
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
