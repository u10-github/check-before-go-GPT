import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
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
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [menuItem, setMenuItem] = useState<ChecklistItem | null>(null)

  const pendingCount = useMemo(() => items.filter((item) => !item.checked).length, [items])
  const checkedCount = items.length - pendingCount
  const hasCheckedItems = checkedCount > 0

  const closeMenu = () => {
    setMenuAnchorEl(null)
    setMenuItem(null)
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 680, mx: 'auto' }}>
      <PageHeader
        title={intl.formatMessage({ id: 'checklist.title' })}
        titleVariant="h5"
        showSettings
      />

      {items.length === 0 ? (
        <EmptyState
          title={intl.formatMessage({ id: 'checklist.emptyTitle' })}
          description={intl.formatMessage({ id: 'checklist.emptyDescription' })}
        />
      ) : (
        <Stack spacing={1.25}>
          {items.map((item) => (
            <Stack key={item.id} direction="row" spacing={1} alignItems="stretch">
              <ButtonBase
                onClick={() => toggleItem(item.id)}
                role="checkbox"
                aria-checked={item.checked}
                aria-label={intl.formatMessage({ id: 'checklist.toggleAria' }, { item: item.text })}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: item.checked ? 'success.main' : 'divider',
                  px: 2,
                  py: 1.5,
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  backgroundColor: item.checked ? 'action.selected' : 'background.paper',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                  <Stack spacing={0.75} sx={{ minWidth: 0 }}>
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
                  <Box
                    aria-hidden
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: item.checked ? 'success.main' : 'divider',
                      backgroundColor: item.checked ? 'success.main' : 'transparent',
                      color: item.checked ? 'success.contrastText' : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CheckRoundedIcon sx={{ opacity: item.checked ? 1 : 0.28 }} />
                  </Box>
                </Stack>
              </ButtonBase>
              <IconButton
                aria-label={intl.formatMessage({ id: 'checklist.menuAria' }, { item: item.text })}
                onClick={(event) => {
                  setMenuAnchorEl(event.currentTarget)
                  setMenuItem(item)
                }}
                sx={{ alignSelf: 'center' }}
              >
                <MoreVertRoundedIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}

      <Typography variant="body2" color="text.secondary" textAlign="center">
        {intl.formatMessage({ id: 'checklist.pendingCount' }, { count: pendingCount })}
      </Typography>

      <Stack spacing={2} alignItems="center">
        <IconButton
          aria-label={intl.formatMessage({ id: 'checklist.add' })}
          color="primary"
          onClick={() => {
            setDialogMode('add')
            setActiveItem(null)
            setDialogOpen(true)
          }}
          sx={{
            width: 72,
            height: 72,
            border: '2px solid',
            borderColor: 'primary.main',
            backgroundColor: 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          <AddRoundedIcon fontSize="large" />
        </IconButton>
        <Button
          variant="outlined"
          color="error"
          disabled={!hasCheckedItems}
          startIcon={<RestartAltRoundedIcon />}
          onClick={() => setResetOpen(true)}
          sx={{ width: '100%', maxWidth: 320, py: 1.25, borderWidth: 2, borderRadius: 999 }}
        >
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
          <Typography color="text.secondary">
            <FormattedMessage id="checklist.resetDescription" />
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Stack spacing={1} sx={{ width: '100%' }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => {
                resetChecks()
                setResetOpen(false)
              }}
            >
              <FormattedMessage id="checklist.confirmReset" />
            </Button>
            <Button fullWidth onClick={() => setResetOpen(false)}>
              <FormattedMessage id="common.cancel" />
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={menuAnchorEl} open={menuItem !== null} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            if (!menuItem) {
              return
            }

            setDialogMode('edit')
            setActiveItem(menuItem)
            setDialogOpen(true)
            closeMenu()
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="checklist.edit" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!menuItem) {
              return
            }

            deleteItem(menuItem.id)
            closeMenu()
          }}
        >
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="checklist.delete" />
        </MenuItem>
      </Menu>
    </Stack>
  )
}
