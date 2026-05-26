import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'

import { CardWrapper, CardInfo, InfoGrid, DeleteButton } from './styles'

import type { PresetCardProps } from './types'

const PresetCard = ({ preset, onDelete }: PresetCardProps) => (
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
    </CardInfo>
    <DeleteButton color="error" onClick={() => onDelete(preset.id)} size="large">
      <DeleteIcon />
    </DeleteButton>
  </CardWrapper>
)

export default PresetCard
