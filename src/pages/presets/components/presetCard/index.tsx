import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import dayjs from 'dayjs'

import { CardWrapper, CardInfo, InfoGrid, CardDates, CardActions, DateChip } from './styles'

import type { PresetCardProps } from './types'

const PresetCard = ({ preset, onDelete, onEdit }: PresetCardProps) => (
  <CardWrapper elevation={2}>
    <CardInfo>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {preset.receiverName}
      </Typography>
      <InfoGrid>
        <Typography variant="body2" color="text.secondary">
          <strong>PIX:</strong> {preset.pix}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Banco:</strong> {preset.bank}
        </Typography>
      </InfoGrid>
      <CardDates>
        <DateChip
          label={`Criado em: ${dayjs(preset.createdAt).format('DD/MM/YYYY [às] HH:mm')}`}
          variant="outlined"
          size="small"
        />
        <DateChip
          label={`Atualizado em: ${dayjs(preset.updatedAt).format('DD/MM/YYYY [às] HH:mm')}`}
          variant="outlined"
          size="small"
        />
      </CardDates>
    </CardInfo>
    <CardActions>
      <IconButton onClick={() => onEdit(preset)} size="large">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => onDelete(preset.id)} size="large">
        <DeleteIcon />
      </IconButton>
    </CardActions>
  </CardWrapper>
)

export default PresetCard
