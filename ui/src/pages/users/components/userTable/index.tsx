import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

import Table, { TableColumn } from '@components/table'
import EmptyState from '@components/emptyState'

import type { UserTableProps } from './types'
import type { User } from '@services/users/types'

const UserTable = ({
  users,
  loading,
  currentUserId,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete
}: UserTableProps) => {
  const columns: TableColumn<User>[] = [
    {
      id: 'user',
      label: 'Usuário',
      render: (user) => (
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
      )
    },
    {
      id: 'email',
      label: 'E-mail',
      render: (user) => user.email
    },
    {
      id: 'department',
      label: 'Departamento',
      render: (user) => user.department || '-'
    },
    {
      id: 'role',
      label: 'Perfil',
      align: 'center',
      render: (user) => (
        <Chip
          label={user.role === 'admin' ? 'Administrador' : 'Usuário'}
          color={user.role === 'admin' ? 'primary' : 'default'}
          size="small"
          variant={user.role === 'admin' ? 'filled' : 'outlined'}
        />
      )
    },
    {
      id: 'createdAt',
      label: 'Data de Cadastro',
      align: 'center',
      render: (user) => new Date(user.createdAt).toLocaleDateString('pt-BR')
    },
    {
      id: 'actions',
      label: 'Ações',
      align: 'right',
      render: (user) => {
        const isCurrentUser = user.id === currentUserId
        return (
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
        )
      }
    }
  ]

  return (
    <Table
      columns={columns}
      data={users}
      getRowKey={(user) => user.id}
      loading={loading}
      ariaLabel="Tabela de usuários"
      emptyState={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 200 }}>
          <EmptyState
            icon={<PersonSearchIcon sx={{ fontSize: 32 }} />}
            title="Nenhum usuário encontrado"
            description="Tente alterar os termos de pesquisa ou filtros aplicados."
          />
        </Box>
      }
      pagination={
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
      }
    />
  )
}

export default UserTable

