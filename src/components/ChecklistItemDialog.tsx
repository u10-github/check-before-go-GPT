import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useIntl } from 'react-intl'

interface ChecklistItemDialogProps {
  mode: 'add' | 'edit'
  open: boolean
  initialValue?: string
  onClose: () => void
  onSubmit: (text: string) => void
}

export function ChecklistItemDialog({
  mode,
  open,
  initialValue = '',
  onClose,
  onSubmit,
}: ChecklistItemDialogProps) {
  const intl = useIntl()
  const [value, setValue] = useState(initialValue)

  const trimmed = value.trim()

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {intl.formatMessage({
          id: mode === 'add' ? 'checklist.addDialogTitle' : 'checklist.editDialogTitle',
        })}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label={intl.formatMessage({ id: 'checklist.itemLabel' })}
          placeholder={intl.formatMessage({ id: 'checklist.itemPlaceholder' })}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>{intl.formatMessage({ id: 'common.cancel' })}</Button>
        <Button
          variant="contained"
          disabled={trimmed.length === 0}
          onClick={() => {
            onSubmit(trimmed)
            onClose()
          }}
        >
          {intl.formatMessage({ id: 'common.save' })}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
