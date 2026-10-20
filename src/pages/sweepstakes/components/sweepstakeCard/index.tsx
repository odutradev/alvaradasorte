import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs'

import { CardContainer, InfoWrapper, InfoGrid, ActionsWrapper } from './styles'
import { QuotaProgress } from '@components/quotaProgress'
import { formatCurrency } from '@utils/string'

import type { SweepstakeCardProps } from './types'

const SweepstakeCard = ({ sweepstake, onViewDetails, onEdit, onDelete }: SweepstakeCardProps) => (
  <CardContainer elevation={0}>
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
      <Tooltip title="Editar bolão">
        <IconButton color="primary" onClick={() => onEdit(sweepstake)} size="small">
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir bolão">
        <IconButton color="error" onClick={() => onDelete(sweepstake)} size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ver detalhes">
        <IconButton color="info" onClick={() => onViewDetails(sweepstake.id)} size="small">
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ActionsWrapper>
  </CardContainer>
)

export default SweepstakeCard