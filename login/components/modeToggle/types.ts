import type { LoginMode } from '../../hook/types'

export interface ModeToggleProps {
  mode: LoginMode
  onClick: () => void
}
