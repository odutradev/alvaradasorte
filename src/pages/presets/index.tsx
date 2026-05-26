import PresetFormModal from './components/presetFormModal'
import { PageWrapper, ContentContainer } from './styles'
import GridBackground from '@components/gridBackground'
import PresetList from './components/presetList'
import Subheader from '@components/subheader'
import Header from '@components/header'
import usePresets from './hook'

const Presets = () => {
  const { handleSubmit, handleDelete, handleEdit, setModalOpen, editingPreset, modalOpen, onSubmit, register, presets, user } = usePresets()

  if (!user) return null

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <Subheader
            title="Predefinições de Pagamento"
            buttonLabel="Nova Predefinição"
            onButtonClick={() => setModalOpen(true)}
          />
          <PresetList presets={presets} onDelete={handleDelete} onEdit={handleEdit} />
        </ContentContainer>
        <PresetFormModal
          isEditing={!!editingPreset}
          open={modalOpen}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onClose={() => setModalOpen(false)}
        />
      </PageWrapper>
    </GridBackground>
  )
}

export default Presets
