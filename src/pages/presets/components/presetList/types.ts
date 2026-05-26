import type { PresetResponse } from '@services/presets/types'

export interface PresetListProps {
  onEdit: (preset: PresetResponse) => void
  onDelete: (id: string) => Promise<void>
  presets: PresetResponse[]
}
