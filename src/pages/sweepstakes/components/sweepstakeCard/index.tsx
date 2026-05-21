import VisibilityIcon from '@mui/icons-material/Visibility'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { InfoGrid } from './styles'

import type { SweepstakeCardProps } from './types'

const SweepstakeCard = ({ sweepstake, onViewDetails }: SweepstakeCardProps) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 2
    }}
  >
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {sweepstake.title}
      </Typography>
      <InfoGrid>
        <Typography variant="body2" color="text.secondary">
          <strong>Cotas Disponíveis:</strong> {sweepstake.availableQuotas}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Valor do Prêmio:</strong> R$ {sweepstake.prizeValue.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Sorteio:</strong> {dayjs(sweepstake.drawDate).format('DD/MM/YYYY')}
        </Typography>
      </InfoGrid>
    </Box>
    <IconButton color="primary" onClick={() => onViewDetails(sweepstake.id)} size="large" sx={{ ml: 2 }}>
      <VisibilityIcon />
    </IconButton>
  </Paper>
)

export default SweepstakeCard