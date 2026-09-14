import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import TableRow from '@mui/material/TableRow'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Table from '@mui/material/Table'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { TableContainerWrapper, TableHeader, ActionsContainer, EmptyBox } from './styles'
import StatementValidationModal from '../statementValidationModal'
import EditParticipantModal from '../editParticipantModal'
import AddParticipantModal from '../addParticipantModal'
import { capitalizeWords } from '@utils/string'
import useParticipantsTable from './hook'

import type { ParticipantsTableProps } from './types'

const ParticipantsTable = ({ participations, sweepstakeId, onUpdate }: ParticipantsTableProps) => {
  const {
    editingParticipation,
    deletingParticipation,
    selectedReceipt,
    selectedUser,
    isValidationOpen,
    isAddModalOpen,
    isDeleting,
    copiedList,
    searchQuery,
    filteredParticipations,
    sortedParticipations,
    setEditingParticipation,
    setDeletingParticipation,
    setIsValidationOpen,
    setIsAddModalOpen,
    setSearchQuery,
    handleOpenReceipt,
    handleCloseReceipt,
    handleDeleteConfirm,
    handleCopyList
  } = useParticipantsTable({ participations, sweepstakeId, onUpdate })

  return (
    <TableContainerWrapper elevation={2}>
      <TableHeader>
        <Typography variant="h6" fontWeight={600}>
          Participantes ({participations.length})
        </Typography>
        <ActionsContainer>
          {sweepstakeId && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Adicionar Participante
            </Button>
          )}
          <Button
            size="small"
            variant="outlined"
            onClick={handleCopyList}
            color={copiedList ? 'success' : 'primary'}
            disabled={sortedParticipations.length === 0}
          >
            {copiedList ? 'Copiado!' : 'Copiar Lista'}
          </Button>
          <Button size="small" variant="outlined" onClick={() => setIsValidationOpen(true)}>
            Validar Extrato
          </Button>
        </ActionsContainer>
      </TableHeader>
      <TextField
        placeholder="Pesquisar participante..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />
      {filteredParticipations.length === 0 ? (
        <EmptyBox>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Nenhum participante encontrado.' : 'Nenhum participante ainda.'}
          </Typography>
        </EmptyBox>
      ) : (
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Setor</strong></TableCell>
                <TableCell><strong>Cotas</strong></TableCell>
                <TableCell><strong>Telefone</strong></TableCell>
                <TableCell><strong>Data de Adesão</strong></TableCell>
                <TableCell align="right"><strong>Comprovante</strong></TableCell>
                {sweepstakeId && <TableCell align="center"><strong>Ações</strong></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParticipations.map((part) => (
                <TableRow key={part.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={part.userPhotoUrl}
                        alt={part.userName}
                        sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
                      >
                        {part.userName ? part.userName.substring(0, 2).toUpperCase() : 'U'}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {part.userName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {capitalizeWords(part.userDepartment || part.userSector || part.sector || '—')}
                  </TableCell>
                  <TableCell>{part.quotaCount ?? 1}</TableCell>
                  <TableCell>{part.userPhone || '—'}</TableCell>
                  <TableCell>{dayjs(part.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell align="right">
                    {part.receiptUrl ? (
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleOpenReceipt(part.receiptUrl, part.userName)}
                        underline="hover"
                      >
                        Visualizar
                      </Link>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Manual</Typography>
                    )}
                  </TableCell>
                  {sweepstakeId && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        title="Editar participante"
                        onClick={() => setEditingParticipation(part)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        title="Excluir participação"
                        onClick={() => setDeletingParticipation(part)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={!!selectedReceipt} onClose={handleCloseReceipt} fullWidth maxWidth="sm">
        <DialogTitle>Comprovante - {selectedUser}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Box
            component="img"
            src={selectedReceipt ?? ''}
            alt="Comprovante"
            sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button href={selectedReceipt ?? ''} target="_blank" rel="noreferrer" color="secondary">
            Abrir em nova aba
          </Button>
          <Button onClick={handleCloseReceipt} color="primary">Fechar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deletingParticipation} onClose={() => setDeletingParticipation(null)}>
        <DialogTitle>Excluir Participação</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            Tem certeza de que deseja remover a participação de <strong>{deletingParticipation?.userName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingParticipation(null)} color="inherit" disabled={isDeleting}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
      <StatementValidationModal
        participations={participations}
        open={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />
      {sweepstakeId && (
        <>
          <AddParticipantModal
            open={isAddModalOpen}
            sweepstakeId={sweepstakeId}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={() => onUpdate?.()}
          />
          <EditParticipantModal
            open={!!editingParticipation}
            participation={editingParticipation}
            sweepstakeId={sweepstakeId}
            onClose={() => setEditingParticipation(null)}
            onSuccess={() => onUpdate?.()}
          />
        </>
      )}
    </TableContainerWrapper>
  )
}

export default ParticipantsTable