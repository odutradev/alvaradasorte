import type { PresetResponse } from '@services/presets/types'

export interface PresetCardProps {
  onEdit: (preset: PresetResponse) => void
  onDelete: (id: string) => Promise<void>
  preset: PresetResponse
}
