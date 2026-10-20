import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { Container, IconWrapper } from './styles'

import type { EmptyStateProps } from './types'

const EmptyState = ({ description, title, icon, action, sx }: EmptyStateProps) => {
  const renderedIcon = icon ?? <InboxOutlinedIcon sx={{ fontSize: 32 }} />

  return (
    <Container elevation={0} sx={sx}>
      <IconWrapper>{renderedIcon}</IconWrapper>
      {title && (
        <Typography variant="subtitle1" fontWeight={600} color="text.primary" align="center">
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 440, lineHeight: 1.6 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Container>
  )
}

export default EmptyState