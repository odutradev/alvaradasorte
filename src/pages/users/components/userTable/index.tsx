import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Table from '@mui/material/Table'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { StyledTableContainer, StyledTableRow, HeaderCell } from './styles'
import EmptyState from '@components/emptyState'

import type { UserTableProps } from './types'

const UserTable = ({ users, loading, currentUserId, total, page, limit, onPageChange, onLimitChange, onEdit, onDelete }: UserTableProps) => {
  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 200 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 200 }}>
        <EmptyState title="Nenhum usuário encontrado" description="Tente alterar os termos de pesquisa ou filtros aplicados." />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <StyledTableContainer>
        <Table aria-label="Tabela de usuários">
          <TableHead>
            <StyledTableRow>
              <HeaderCell>Usuário</HeaderCell>
              <HeaderCell>E-mail</HeaderCell>
              <HeaderCell>Departamento</HeaderCell>
              <HeaderCell align="center">Perfil</HeaderCell>
              <HeaderCell align="center">Data de Cadastro</HeaderCell>
              <HeaderCell align="right">Ações</HeaderCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId
              const formattedDate = new Date(user.createdAt).toLocaleDateString('pt-BR')

              return (
                <StyledTableRow key={user.id}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={user.photoUrl} alt={user.name}>
                        {user.name?.charAt(0).toUpperCase() ?? 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {user.fullName || user.name}
                        </Typography>
                        {user.fullName && (
                          <Typography variant="caption" color="text.secondary">
                            {user.name}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                      variant={user.role === 'admin' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="center">{formattedDate}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Editar usuário">
                        <IconButton size="small" color="primary" onClick={() => onEdit(user)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={isCurrentUser ? 'Você não pode excluir seu próprio perfil' : 'Excluir usuário'}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={isCurrentUser}
                            onClick={() => onDelete(user)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </StyledTableRow>
              )
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) => onLimitChange(Number(event.target.value))}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Itens por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Box>
  )
}

export default UserTable
