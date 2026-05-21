import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { InfoGrid } from './styles'

import type { PresetCardProps } from './types'

const PresetCard = ({ preset, onDelete }: PresetCardProps) => (
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
        {preset.receiverName}
      </Typography>
      <InfoGrid>
        <Typography variant="body2" color="text.secondary">
          <strong>PIX:</strong> {preset.pix}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Banco:</strong> {preset.bank}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Decrição:</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
           {preset.description}
        </Typography>
      </InfoGrid>
    </Box>
    <IconButton color="error" onClick={() => onDelete(preset.id)} size="large" sx={{ ml: 2 }}>
      <DeleteIcon />
    </IconButton>
  </Paper>
)

export default PresetCard