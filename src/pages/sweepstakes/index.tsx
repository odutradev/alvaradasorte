import Button from '@mui/material/Button'
import Modal from '@components/modal'

import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

import { ContainerWrapper, TableHeader, ActionsContainer } from './styles'
import SweepstakeFormModal from './components/sweepstakeFormModal'
import SweepstakeList from './components/sweepstakeList'
import PageContainer from '@components/pageContainer'
import useSweepstakesAdmin from './hook'

const Sweepstakes = () => {
  const {
    setDeletingSweepstake,
    deletingSweepstake,
    editingSweepstake,
    handleCloseModal,
    handleCreateNew,
    loadSweepstakes,
    confirmDelete,
    handleDelete,
    viewDetails,
    sweepstakes,
    handleEdit,
    modalOpen,
    user
  } = useSweepstakesAdmin()

  if (!user) return null

  return (
    <PageContainer fullHeight>
      <ContainerWrapper elevation={0}>
        <TableHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>
              Gerenciamento de Bolões
            </Typography>
            <Chip
              label={sweepstakes.length}
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
              onClick={handleCreateNew}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500 }}
            >
              Novo Bolão
            </Button>
          </ActionsContainer>
        </TableHeader>
        <SweepstakeList
          sweepstakes={sweepstakes}
          onViewDetails={viewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ContainerWrapper>
      <SweepstakeFormModal
        initialData={editingSweepstake}
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={loadSweepstakes}
      />
      <Modal
        open={!!deletingSweepstake}
        onClose={() => setDeletingSweepstake(null)}
        maxWidth="xs"
        title="Excluir Bolão"
        subtitle="Confirmação de exclusão"
        actions={
          <>
            <Button onClick={() => setDeletingSweepstake(null)} color="inherit">
              Cancelar
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Excluir
            </Button>
          </>
        }
      >
        <Typography variant="body1">
          Tem certeza que deseja excluir o bolão <strong>{deletingSweepstake?.title}</strong>? Esta ação é irreversível e apagará todos os dados vinculados a ele.
        </Typography>
      </Modal>
    </PageContainer>
  )
}

export default Sweepstakes