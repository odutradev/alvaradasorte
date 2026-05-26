import type { PresetResponse } from '@services/presets/types'

export interface PresetListProps {
  presets: PresetResponse[]
  onDelete: (id: string) => Promise<void>
}
