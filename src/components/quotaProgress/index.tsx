import Typography from '@mui/material/Typography'

import { ProgressWrapper, LabelRow, StyledLinearProgress } from './styles'

import type { QuotaProgressProps } from './types'

export const QuotaProgress = ({ availableQuotas, filledQuotas }: QuotaProgressProps) => {
  const percentage = Math.min(100, Math.round((filledQuotas / availableQuotas) * 100))

  return (
    <ProgressWrapper>
      <LabelRow>
        <Typography variant="body2" color="text.secondary">
          Vagas Preenchidas
        </Typography>
        <Typography variant="body2" fontWeight={600} color="primary">
          {filledQuotas} de {availableQuotas} preenchidas
        </Typography>
      </LabelRow>
      <StyledLinearProgress variant="determinate" value={percentage} />
    </ProgressWrapper>
  )
}