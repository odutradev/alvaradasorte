import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import Table from '@mui/material/Table'
import Link from '@mui/material/Link'
import dayjs from 'dayjs'

import { TableContainerWrapper, EmptyBox } from './styles'

import type { ParticipantsTableProps } from './types'

export const ParticipantsTable = ({ participations }: ParticipantsTableProps) => {
  const sortedParticipations = [...participations].sort((a, b) =>
    a.userName.localeCompare(b.userName)
  )

  return (
    <TableContainerWrapper elevation={2}>
      <Typography variant="h6" fontWeight={600}>
        Participantes ({participations.length})
      </Typography>
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
                    <Link href={part.receiptUrl} target="_blank" rel="noreferrer" underline="hover">
                      Visualizar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </TableContainerWrapper>
  )
}