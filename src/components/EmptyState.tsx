import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded'
import { Stack, Typography } from '@mui/material'
import { PageSection } from './PageSection'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <PageSection>
      <Stack spacing={2} alignItems="center" py={4} px={2.5} textAlign="center">
        <ChecklistRoundedIcon color="primary" sx={{ fontSize: 48 }} />
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </PageSection>
  )
}
