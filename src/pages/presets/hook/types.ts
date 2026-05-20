import type { PresetResponse } from '@services/presets/types'
import type { AuthUser } from '@stores/auth/types'

export interface UsePresetsReturn {
  handleDelete: (id: string) => Promise<void>
  setModalOpen: (open: boolean) => void
  loadPresets: () => Promise<void>
  presets: PresetResponse[]
  logout: () => Promise<void>
  user: AuthUser | null
  modalOpen: boolean
}