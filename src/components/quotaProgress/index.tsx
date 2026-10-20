import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'

import { ProgressWrapper, LabelRow, StyledLinearProgress } from './styles'
import useCountUp from '@hooks/useCountUp'

import type { QuotaProgressProps } from './types'

export const QuotaProgress = ({ availableQuotas, filledQuotas }: QuotaProgressProps) => {
  const percentage = Math.min(100, Math.round((filledQuotas / availableQuotas) * 100))
  const [currentProgress, setCurrentProgress] = useState(0)
  const animatedFilled = useCountUp(filledQuotas, 1400)
  const animatedPercentage = Math.min(100, Math.round((animatedFilled / availableQuotas) * 100))

  useEffect(() => {
    setCurrentProgress(0)
    const timer = setTimeout(() => {
      setCurrentProgress(percentage)
    }, 40)

    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <ProgressWrapper>
      <LabelRow>
        <Typography variant="body2" color="text.secondary">
          Vagas Preenchidas
        </Typography>
        <Typography variant="body2" fontWeight={600} color="primary">
          {animatedFilled} de {availableQuotas} ({animatedPercentage}%)
        </Typography>
      </LabelRow>
      <StyledLinearProgress variant="determinate" value={currentProgress} />
    </ProgressWrapper>
  )
}