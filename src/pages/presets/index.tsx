import { PageWrapper, ContentContainer, ListContainer } from './styles'
import PresetFormModal from './components/presetFormModal'
import GridBackground from '@components/gridBackground'
import EmptyState from '@components/emptyState'
import PresetCard from './components/presetCard'
import Subheader from '@components/subheader'
import Header from '@components/header'
import usePresets from './hook'

const PresetsPage = () => {
  const {
    handleSubmit,
    handleDelete,
    setModalOpen,
    modalOpen,
    onSubmit,
    register,
    presets,
    user
  } = usePresets()

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
          <ListContainer>
            {presets.map((preset) => (
              <PresetCard key={preset.id} preset={preset} onDelete={handleDelete} />
            ))}
            {presets.length === 0 && (
              <EmptyState description="Nenhuma predefinição cadastrada no sistema." />
            )}
          </ListContainer>
        </ContentContainer>
        <PresetFormModal
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

export default PresetsPage