import VisibilityIcon from '@mui/icons-material/Visibility'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'

import { CardContainer, InfoWrapper, InfoGrid, ActionsWrapper } from './styles'
import { QuotaProgress } from '@components/quotaProgress'
import { formatCurrency } from '@utils/string'

import type { SweepstakeCardProps } from './types'

const SweepstakeCard = ({ sweepstake, onViewDetails, onEdit, onDelete }: SweepstakeCardProps) => (
  <CardContainer elevation={2}>
    <InfoWrapper>
      <Typography variant="h6" fontWeight={600}>
        {sweepstake.title}
      </Typography>
      {sweepstake.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
          {sweepstake.description}
        </Typography>
      )}
      <QuotaProgress
        availableQuotas={sweepstake.availableQuotas}
        filledQuotas={sweepstake.metadata?.filledQuotas ?? 0}
      />
      <InfoGrid>
        <Typography variant="body2" color="text.secondary">
          <strong>Valor do Prêmio:</strong> {formatCurrency(sweepstake.prizeValue)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Sorteio:</strong> {dayjs(sweepstake.drawDate).format('DD/MM/YYYY')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Valor Arrecadado:</strong> {formatCurrency((sweepstake.metadata?.filledQuotas ?? 0) * sweepstake.quotaPrice)}
        </Typography>
      </InfoGrid>
    </InfoWrapper>
    <ActionsWrapper>
      <IconButton color="primary" onClick={() => onEdit(sweepstake)} size="small">
        <EditIcon />
      </IconButton>
      <IconButton color="error" onClick={() => onDelete(sweepstake)} size="small">
        <DeleteIcon />
      </IconButton>
      <IconButton color="info" onClick={() => onViewDetails(sweepstake.id)} size="small">
        <VisibilityIcon />
      </IconButton>
    </ActionsWrapper>
  </CardContainer>
)

export default SweepstakeCard