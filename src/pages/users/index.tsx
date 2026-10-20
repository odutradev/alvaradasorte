import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

import { ContainerWrapper, TableHeader } from './styles'
import DeleteUserDialog from './components/deleteUserDialog'
import EditUserModal from './components/editUserModal'
import PageContainer from '@components/pageContainer'
import UserFilters from './components/userFilters'
import UserTable from './components/userTable'
import useUsers from './hook'

const Users = () => {
  const {
    users,
    loading,
    actionLoading,
    search,
    role,
    page,
    limit,
    total,
    currentUser,
    selectedUser,
    isEditOpen,
    isDeleteOpen,
    setPage,
    setLimit,
    handleSearchChange,
    handleRoleChange,
    handleClearFilters,
    handleOpenEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,
    handleUpdateUser,
    handleDeleteUser
  } = useUsers()

  if (!currentUser) return null

  return (
    <PageContainer fullHeight>
      <ContainerWrapper elevation={0}>
        <TableHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>
              Gestão de Usuários
            </Typography>
            <Chip
              label={total}
              size="small"
              color="default"
              sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem', borderRadius: 1 }}
            />
          </Box>
        </TableHeader>
        <UserFilters
          search={search}
          role={role}
          onSearchChange={handleSearchChange}
          onRoleChange={handleRoleChange}
          onClearFilters={handleClearFilters}
        />
        <UserTable
          users={users}
          loading={loading}
          currentUserId={currentUser.id}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </ContainerWrapper>
      <EditUserModal
        open={isEditOpen}
        user={selectedUser}
        loading={actionLoading}
        onClose={handleCloseEdit}
        onSubmit={handleUpdateUser}
      />
      <DeleteUserDialog
        open={isDeleteOpen}
        user={selectedUser}
        loading={actionLoading}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteUser}
      />
    </PageContainer>
  )
}

export default Users
