import Typography from '@mui/material/Typography'

import { RowContainer } from './styles'

import type { InfoRowProps } from './types'

const InfoRow = ({ label, value, valueColor }: InfoRowProps) => (
  <RowContainer>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600} color={valueColor}>
      {value}
    </Typography>
  </RowContainer>
)

export default InfoRow