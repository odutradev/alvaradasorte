import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import Typography from '@mui/material/Typography'

import { Container, IconWrapper } from './styles'

import type { EmptyStateProps } from './types'

export const EmptyState = ({ description, title, icon }: EmptyStateProps) => {
  const renderedIcon = icon ?? <SentimentDissatisfiedIcon sx={{ fontSize: 48 }} />

  return (
    <Container elevation={1}>
      <IconWrapper>{renderedIcon}</IconWrapper>
      {title && (
        <Typography variant="h6" fontWeight={600} align="center">
          {title}
        </Typography>
      )}
      <Typography variant="body1" color="text.secondary" align="center">
        {description}
      </Typography>
    </Container>
  )
}