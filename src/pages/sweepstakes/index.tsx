import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

import SweepstakeFormModal from './components/sweepstakeFormModal'
import { PageWrapper, ContentContainer } from './styles'
import SweepstakeList from './components/sweepstakeList'
import GridBackground from '@components/gridBackground'
import useSweepstakesAdmin from './hook'
import Subheader from '@components/subheader'
import Header from '@components/header'

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
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <Subheader
            title="Gerenciamento de Bolões"
            buttonLabel="Novo Bolão"
            onButtonClick={handleCreateNew}
          />
          <SweepstakeList
            sweepstakes={sweepstakes}
            onViewDetails={viewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </ContentContainer>
        <SweepstakeFormModal
          initialData={editingSweepstake}
          open={modalOpen}
          onClose={handleCloseModal}
          onSuccess={loadSweepstakes}
        />
        <Dialog open={!!deletingSweepstake} onClose={() => setDeletingSweepstake(null)}>
          <DialogTitle>Excluir Bolão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o bolão <strong>{deletingSweepstake?.title}</strong>?
              Esta ação é irreversível e apagará todos os dados vinculados a ele.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletingSweepstake(null)} color="inherit">
              Cancelar
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </PageWrapper>
    </GridBackground>
  )
}

export default Sweepstakes