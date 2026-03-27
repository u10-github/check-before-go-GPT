import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ChecklistItemDialog } from '../components/ChecklistItemDialog'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { useAppState } from '../context/AppStateContext'
import type { ChecklistItem } from '../types'

export function ChecklistPage() {
  const intl = useIntl()
  const { items, addItem, updateItem, deleteItem, toggleItem, resetChecks } = useAppState()
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [activeItem, setActiveItem] = useState<ChecklistItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const pendingCount = useMemo(() => items.filter((item) => !item.checked).length, [items])
  const checkedCount = items.length - pendingCount
  const hasCheckedItems = checkedCount > 0

  return (
    <Stack spacing={3}>
      <PageHeader
        title={intl.formatMessage({ id: 'checklist.title' })}
        description={intl.formatMessage({ id: 'checklist.description' })}
        showSettings
      />

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          color="primary"
          label={intl.formatMessage({ id: 'checklist.pendingCount' }, { count: pendingCount })}
        />
        <Chip
          color="success"
          variant="outlined"
          label={intl.formatMessage({ id: 'checklist.checkedCount' }, { count: checkedCount })}
        />
      </Stack>

      {items.length === 0 ? (
        <EmptyState
          title={intl.formatMessage({ id: 'checklist.emptyTitle' })}
          description={intl.formatMessage({ id: 'checklist.emptyDescription' })}
        />
      ) : (
        <Card variant="outlined">
          <CardContent sx={{ p: 1.5 }}>
            <List disablePadding>
              {items.map((item, index) => (
                <Stack key={item.id}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          aria-label={intl.formatMessage({ id: 'checklist.editAria' }, { item: item.text })}
                          edge="end"
                          onClick={() => {
                            setDialogMode('edit')
                            setActiveItem(item)
                            setDialogOpen(true)
                          }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label={intl.formatMessage(
                            { id: 'checklist.deleteAria' },
                            { item: item.text },
                          )}
                          edge="end"
                          onClick={() => deleteItem(item.id)}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemButton
                      onClick={() => toggleItem(item.id)}
                      sx={{ py: 1.5, pr: 11 }}
                      aria-label={intl.formatMessage({ id: 'checklist.toggleAria' }, { item: item.text })}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox edge="start" checked={item.checked} tabIndex={-1} disableRipple />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        secondary={intl.formatMessage({
                          id: item.checked ? 'checklist.statusChecked' : 'checklist.statusPending',
                        })}
                        sx={{
                          textDecoration: item.checked ? 'line-through' : 'none',
                          opacity: item.checked ? 0.7 : 1,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < items.length - 1 ? <Divider component="li" /> : null}
                </Stack>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Stack spacing={1.5}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setDialogMode('add')
            setActiveItem(null)
            setDialogOpen(true)
          }}
        >
          <FormattedMessage id="checklist.add" />
        </Button>
        <Button variant="text" disabled={!hasCheckedItems} onClick={() => setResetOpen(true)}>
          <FormattedMessage id="checklist.reset" />
        </Button>
      </Stack>

      <ChecklistItemDialog
        key={`${dialogMode}-${activeItem?.id ?? 'new'}-${dialogOpen ? 'open' : 'closed'}`}
        mode={dialogMode}
        open={dialogOpen}
        initialValue={activeItem?.text}
        onClose={() => setDialogOpen(false)}
        onSubmit={(text) => {
          if (dialogMode === 'add') {
            addItem(text)
            return
          }

          if (activeItem) {
            updateItem(activeItem.id, text)
          }
        }}
      />

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>
          <FormattedMessage id="checklist.resetTitle" />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage id="checklist.resetDescription" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setResetOpen(false)}>
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              resetChecks()
              setResetOpen(false)
            }}
          >
            <FormattedMessage id="checklist.confirmReset" />
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
