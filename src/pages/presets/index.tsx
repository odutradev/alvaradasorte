import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

import { ContainerWrapper, TableHeader, ActionsContainer } from './styles'
import PresetFormModal from './components/presetFormModal'
import PageContainer from '@components/pageContainer'
import PresetList from './components/presetList'
import usePresets from './hook'

const Presets = () => {
  const { handleSubmit, handleDelete, handleEdit, setModalOpen, editingPreset, modalOpen, onSubmit, register, presets, user } = usePresets()

  if (!user) return null

  return (
    <PageContainer fullHeight>
      <ContainerWrapper elevation={0}>
        <TableHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>
              Predefinições de Pagamento
            </Typography>
            <Chip
              label={presets.length}
              size="small"
              color="default"
              sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem', borderRadius: 1 }}
            />
          </Box>
          <ActionsContainer>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => setModalOpen(true)}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500 }}
            >
              Nova Predefinição
            </Button>
          </ActionsContainer>
        </TableHeader>
        <PresetList presets={presets} onDelete={handleDelete} onEdit={handleEdit} />
      </ContainerWrapper>
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
