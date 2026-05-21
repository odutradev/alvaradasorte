import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { HeaderSection } from './styles'

import type { PresetHeaderProps } from './types'

const PresetHeader = ({ onAdd }: PresetHeaderProps) => (
  <HeaderSection>
    <Typography variant="h4" fontWeight={700} color="primary">
      Predefinições de Pagamento
    </Typography>
    <Button variant="contained" size="large" onClick={onAdd}>
      Nova Predefinição
    </Button>
  </HeaderSection>
)

export default PresetHeader