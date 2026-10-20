import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import InputAdornment from '@mui/material/InputAdornment'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
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
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { TableContainerWrapper, StyledTableContainer, TableHeader, ActionsContainer } from './styles'
import StatementValidationModal from '../statementValidationModal'
import EditParticipantModal from '../editParticipantModal'
import AddParticipantModal from '../addParticipantModal'
import { capitalizeWords } from '@utils/string'
import EmptyState from '@components/emptyState'
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
    <TableContainerWrapper elevation={0}>
      <TableHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" fontWeight={600}>
            Participantes
          </Typography>
          <Chip
            label={searchQuery ? `${filteredParticipations.length} de ${participations.length}` : participations.length}
            size="small"
            color="default"
            sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem', borderRadius: 1 }}
          />
        </Box>
        <ActionsContainer>
          {sweepstakeId && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<PersonAddOutlinedIcon fontSize="small" />}
              onClick={() => setIsAddModalOpen(true)}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500 }}
            >
              Adicionar Participante
            </Button>
          )}
          <Button
            size="small"
            variant="outlined"
            onClick={handleCopyList}
            startIcon={copiedList ? <CheckIcon fontSize="small" /> : <ContentCopyOutlinedIcon fontSize="small" />}
            color={copiedList ? 'success' : 'primary'}
            disabled={sortedParticipations.length === 0}
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500 }}
          >
            {copiedList ? 'Copiado!' : 'Copiar Lista'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ReceiptLongOutlinedIcon fontSize="small" />}
            onClick={() => setIsValidationOpen(true)}
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500 }}
          >
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
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery('')} edge="end" aria-label="Limpar pesquisa">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
      {filteredParticipations.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'Nenhum participante encontrado' : 'Nenhum participante cadastrado'}
          description={
            searchQuery
              ? `Nenhum resultado corresponde a "${searchQuery}". Verifique a digitação ou limpe o filtro.`
              : 'Ainda não há nenhum participante cadastrado neste bolão.'
          }
          action={
            searchQuery ? (
              <Button size="small" variant="outlined" onClick={() => setSearchQuery('')} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Limpar filtro de pesquisa
              </Button>
            ) : undefined
          }
        />
      ) : (
        <StyledTableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Nome</TableCell>
                <TableCell sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Setor</TableCell>
                <TableCell sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Cotas</TableCell>
                <TableCell sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Telefone</TableCell>
                <TableCell sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Data de Adesão</TableCell>
                <TableCell align="center" sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Comprovante</TableCell>
                {sweepstakeId && <TableCell align="center" sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Ações</TableCell>}
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
                  <TableCell align="center">
                    {part.receiptUrl ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
                        onClick={() => handleOpenReceipt(part.receiptUrl, part.userName)}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          py: 0.25,
                          px: 1,
                          borderRadius: 1.5,
                          fontWeight: 500
                        }}
                      >
                        Visualizar
                      </Button>
                    ) : (
                      <Chip
                        size="small"
                        label="Manual"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 22,
                          borderColor: 'divider',
                          color: 'text.secondary'
                        }}
                      />
                    )}
                  </TableCell>
                  {sweepstakeId && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
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
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
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