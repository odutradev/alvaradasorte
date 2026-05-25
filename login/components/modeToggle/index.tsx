import { ToggleButton } from './styles'

import type { ModeToggleProps } from './types'

const TOGGLE_LABEL = {
  login: 'Não tem uma conta? Cadastre-se',
  register: 'Já tem uma conta? Faça Login'
}

const ModeToggle = ({ mode, onClick }: ModeToggleProps) => (
  <ToggleButton onClick={onClick}>
    {TOGGLE_LABEL[mode]}
  </ToggleButton>
)

export default ModeToggle
