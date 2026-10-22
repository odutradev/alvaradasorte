import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs'

import { CardWrapper, CardInfo, InfoGrid, CardDates, CardActions, DateChip } from './styles'

import type { PresetCardProps } from './types'

const PresetCard = ({ preset, onDelete, onEdit }: PresetCardProps) => (
  <CardWrapper elevation={0}>
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
      <Tooltip title="Editar predefinição">
        <IconButton color="primary" onClick={() => onEdit(preset)} size="small">
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir predefinição">
        <IconButton color="error" onClick={() => onDelete(preset.id)} size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </CardActions>
  </CardWrapper>
)

export default PresetCard
