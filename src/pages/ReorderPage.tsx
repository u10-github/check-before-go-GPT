import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import {
  Box,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { PageSection } from '../components/PageSection'
import { useAppState } from '../context/AppStateContext'

export function ReorderPage() {
  const intl = useIntl()
  const { items, moveItem } = useAppState()

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 680, mx: 'auto' }}>
      <PageHeader
        title={intl.formatMessage({ id: 'reorder.title' })}
        description={intl.formatMessage({ id: 'reorder.description' })}
        showBack
        fallbackTo="/settings"
      />

      {items.length === 0 ? (
        <EmptyState
          title={intl.formatMessage({ id: 'reorder.title' })}
          description={intl.formatMessage({ id: 'reorder.empty' })}
        />
      ) : (
        <PageSection>
          <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
            {items.map((item, index) => (
              <Stack
                key={item.id}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 2.5,
                  py: 1.75,
                  backgroundColor: item.checked ? 'action.selected' : 'transparent',
                }}
              >
                <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                    {item.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={item.checked ? 'success.main' : 'text.secondary'}
                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    <FormattedMessage
                      id={item.checked ? 'checklist.statusChecked' : 'checklist.statusPending'}
                    />
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    aria-label={intl.formatMessage({ id: 'reorder.moveUp' })}
                    disabled={index === 0}
                    onClick={() => moveItem(item.id, 'up')}
                  >
                    <ArrowUpwardRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label={intl.formatMessage({ id: 'reorder.moveDown' })}
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(item.id, 'down')}
                  >
                    <ArrowDownwardRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </PageSection>
      )}

      <Typography variant="body2" color="text.secondary" textAlign="center">
        <FormattedMessage id="common.done" />
      </Typography>
    </Stack>
  )
}
