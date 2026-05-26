import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import SearchIcon from '@mui/icons-material/Search'
import Typography from '@mui/material/Typography'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Table from '@mui/material/Table'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import { useState } from 'react'
import dayjs from 'dayjs'

import { TableContainerWrapper, TableHeader, ActionsContainer, EmptyBox } from './styles'
import StatementValidationModal from '../statementValidationModal'
import { capitalizeWords } from '@utils/string'

import type { ParticipantsTableProps } from './types'

const ParticipantsTable = ({ participations }: ParticipantsTableProps) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isValidationOpen, setIsValidationOpen] = useState(false)
  const [copiedList, setCopiedList] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const sortedParticipations = [...participations].sort((a, b) =>
    a.userName.localeCompare(b.userName)
  )

  const filteredParticipations = sortedParticipations.filter((part) =>
    part.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenReceipt = (url: string, name: string) => {
    setSelectedReceipt(url)
    setSelectedUser(name)
  }

  const handleCloseReceipt = () => {
    setSelectedReceipt(null)
    setSelectedUser(null)
  }

  const handleCopyList = () => {
    const textToCopy = sortedParticipations
      .map((part, index) => {
        const sector = part.userDepartment || part.userSector || part.sector || ''
        const sectorSuffix = sector ? ` - ${capitalizeWords(sector)}` : ''
        return `${index + 1}. ${capitalizeWords(part.userName)}${sectorSuffix}`
      })
      .join('\n')

    const textarea = document.createElement('textarea')
    textarea.value = textToCopy
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    
    try {
      document.execCommand('copy')
      setCopiedList(true)
      setTimeout(() => setCopiedList(false), 2000)
    } catch {
    }
    
    document.body.removeChild(textarea)
  }

  return (
    <TableContainerWrapper elevation={2}>
      <TableHeader>
        <Typography variant="h6" fontWeight={600}>
          Participantes ({participations.length})
        </Typography>
        <ActionsContainer>
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
                <TableCell><strong>Telefone</strong></TableCell>
                <TableCell><strong>Data de Adesão</strong></TableCell>
                <TableCell align="right"><strong>Comprovante</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParticipations.map((part) => (
                <TableRow key={part.id} hover>
                  <TableCell>{part.userName}</TableCell>
                  <TableCell>
                    {capitalizeWords(part.userDepartment || part.userSector || part.sector || '—')}
                  </TableCell>
                  <TableCell>{part.userPhone || '—'}</TableCell>
                  <TableCell>{dayjs(part.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
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

export default ParticipantsTable