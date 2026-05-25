import { ToggleButton } from './styles'

import type { ModeToggleProps } from './types'

const TOGGLE_LABELS = {
  login: 'Não tem uma conta? Cadastre-se',
  register: 'Já tem uma conta? Faça Login'
}

const ModeToggle = ({ mode, onToggle }: ModeToggleProps) => (
  <ToggleButton onClick={onToggle}>
    {TOGGLE_LABELS[mode]}
  </ToggleButton>
)

export default ModeToggle
