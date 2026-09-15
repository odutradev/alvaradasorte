import DeleteUserDialog from './components/deleteUserDialog'
import { PageWrapper, ContentContainer } from './styles'
import EditUserModal from './components/editUserModal'
import GridBackground from '@components/gridBackground'
import UserFilters from './components/userFilters'
import UserTable from './components/userTable'
import Subheader from '@components/subheader'
import Header from '@components/header'
import useUsers from './hook'

const Users = () => {
  const {
    users,
    loading,
    actionLoading,
    search,
    role,
    currentUser,
    selectedUser,
    isEditOpen,
    isDeleteOpen,
    setSearch,
    setRole,
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
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <Subheader title="Gestão de Usuários" />
          <UserFilters
            search={search}
            role={role}
            onSearchChange={setSearch}
            onRoleChange={setRole}
            onClearFilters={handleClearFilters}
          />
          <UserTable
            users={users}
            loading={loading}
            currentUserId={currentUser.id}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        </ContentContainer>
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
      </PageWrapper>
    </GridBackground>
  )
}

export default Users
