import PresetFormModal from './components/presetFormModal'
import { PageWrapper, ContentContainer } from './styles'
import GridBackground from '@components/gridBackground'
import PresetList from './components/presetList'
import Subheader from '@components/subheader'
import Header from '@components/header'
import usePresets from './hook'

const PresetsPage = () => {
  const { handleSubmit, handleDelete, setModalOpen, modalOpen, onSubmit, register, presets, user } = usePresets()

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
          <PresetList presets={presets} onDelete={handleDelete} />
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
