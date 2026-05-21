import TableContainer from '@mui/material/TableContainer'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Table from '@mui/material/Table'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import { useState } from 'react'
import dayjs from 'dayjs'

import { StatementValidationModal } from './subcomponents/statementValidationModal'
import { TableContainerWrapper, TableHeader, EmptyBox } from './styles'

import type { ParticipantsTableProps } from './types'

export const ParticipantsTable = ({ participations }: ParticipantsTableProps) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isValidationOpen, setIsValidationOpen] = useState(false)
  const sortedParticipations = [...participations].sort((a, b) =>
    a.userName.localeCompare(b.userName)
  )

  const handleOpenReceipt = (url: string, name: string) => {
    setSelectedReceipt(url)
    setSelectedUser(name)
  }

  const handleCloseReceipt = () => {
    setSelectedReceipt(null)
    setSelectedUser(null)
  }

  return (
    <TableContainerWrapper elevation={2}>
      <TableHeader>
        <Typography variant="h6" fontWeight={600}>
          Participantes ({participations.length})
        </Typography>
        <Button size="small" variant="outlined" onClick={() => setIsValidationOpen(true)}>
          Validar Extrato
        </Button>
      </TableHeader>
      {sortedParticipations.length === 0 ? (
        <EmptyBox>
          <Typography variant="body2" color="text.secondary">
            Nenhum participante ainda.
          </Typography>
        </EmptyBox>
      ) : (
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Data de Adesão</strong></TableCell>
                <TableCell align="right"><strong>Comprovante</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedParticipations.map((part) => (
                <TableRow key={part.id} hover>
                  <TableCell>{part.userName}</TableCell>
                  <TableCell>
                    {dayjs(part.createdAt).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell align="right">
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleOpenReceipt(part.receiptUrl, part.userName)}
                      underline="hover"
                    >
                      Visualizar
                    </Link>
                  </TableCell>
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
      <StatementValidationModal
        participations={participations}
        open={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />
    </TableContainerWrapper>
  )
}