import EmptyState from '@components/emptyState'
import { ListWrapper } from './styles'
import PresetCard from '../presetCard'

import type { PresetListProps } from './types'

const PresetList = ({ presets, onDelete, onEdit }: PresetListProps) => (
  <ListWrapper>
    {presets.map((preset) => (
      <PresetCard key={preset.id} preset={preset} onDelete={onDelete} onEdit={onEdit} />
    ))}
    {presets.length === 0 && (
      <EmptyState
        title="Nenhuma predefinição cadastrada"
        description="Ainda não existem predefinições cadastradas no sistema."
      />
    )}
  </ListWrapper>
)

export default PresetList
