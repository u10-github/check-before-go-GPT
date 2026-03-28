import { Box } from '@mui/material'
import type { BoxProps, SxProps, Theme } from '@mui/material'

interface PageSectionProps extends Omit<BoxProps, 'sx'> {
  tone?: 'default' | 'subtle'
  sx?: SxProps<Theme>
}

export function PageSection({ tone = 'default', sx, ...props }: PageSectionProps) {
  const baseSx: SxProps<Theme> =
    tone === 'subtle'
      ? {
          p: 2.5,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 3,
          backgroundColor: 'background.default',
        }
      : {
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          overflow: 'hidden',
        }

  return <Box {...props} sx={[baseSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} />
}
