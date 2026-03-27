import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import {
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { useAppState } from '../context/AppStateContext'

export function ReorderPage() {
  const intl = useIntl()
  const { items, moveItem } = useAppState()

  return (
    <Stack spacing={3}>
      <PageHeader
        title={intl.formatMessage({ id: 'reorder.title' })}
        description={intl.formatMessage({ id: 'reorder.description' })}
        showBack
      />

      {items.length === 0 ? (
        <EmptyState
          title={intl.formatMessage({ id: 'reorder.title' })}
          description={intl.formatMessage({ id: 'reorder.empty' })}
        />
      ) : (
        <Card variant="outlined">
          <CardContent>
            <List disablePadding>
              {items.map((item, index) => (
                <ListItem
                  key={item.id}
                  divider={index < items.length - 1}
                  secondaryAction={
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
                  }
                >
                  <ListItemText
                    primary={item.text}
                    secondary={<FormattedMessage id="checklist.statusPending" />}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Typography variant="body2" color="text.secondary" textAlign="center">
        <FormattedMessage id="common.done" />
      </Typography>
    </Stack>
  )
}
