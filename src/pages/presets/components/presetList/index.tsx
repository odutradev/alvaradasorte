import EmptyState from '@components/emptyState'
import { ListWrapper } from './styles'
import PresetCard from '../presetCard'

import type { PresetListProps } from './types'

const PresetList = ({ presets, onDelete }: PresetListProps) => (
  <ListWrapper>
    {presets.map((preset) => (
      <PresetCard key={preset.id} preset={preset} onDelete={onDelete} />
    ))}
    {presets.length === 0 && <EmptyState description="Nenhuma predefinição cadastrada no sistema." />}
  </ListWrapper>
)

export default PresetList
