import PresetFormModal from './components/presetFormModal'
import PageContainer from '@components/pageContainer'
import PresetList from './components/presetList'
import Subheader from '@components/subheader'
import usePresets from './hook'

const Presets = () => {
  const { handleSubmit, handleDelete, handleEdit, setModalOpen, editingPreset, modalOpen, onSubmit, register, presets, user } = usePresets()

  if (!user) return null

  return (
    <PageContainer>
      <Subheader
        title="Predefinições de Pagamento"
        buttonLabel="Nova Predefinição"
        onButtonClick={() => setModalOpen(true)}
      />
      <PresetList presets={presets} onDelete={handleDelete} onEdit={handleEdit} />
      <PresetFormModal
        isEditing={!!editingPreset}
        open={modalOpen}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onClose={() => setModalOpen(false)}
      />
    </PageContainer>
  )
}

export default Presets
