import type { LoginMode } from '../../hook/types'

export interface ModeToggleProps {
  onToggle: () => void
  mode: LoginMode
}
