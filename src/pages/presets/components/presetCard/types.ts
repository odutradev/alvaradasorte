import type { PresetResponse } from '@services/presets/types'

export interface PresetCardProps {
  preset: PresetResponse
  onDelete: (id: string) => void
}