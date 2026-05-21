import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Container } from './styles'

import type { SubheaderProps } from './types'

const Subheader = ({ title, buttonLabel, onButtonClick }: SubheaderProps) => (
  <Container>
    <Typography variant="h4" fontWeight={700} color="primary">
      {title}
    </Typography>
    {buttonLabel && onButtonClick && (
      <Button variant="contained" size="large" onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    )}
  </Container>
)

export default Subheader