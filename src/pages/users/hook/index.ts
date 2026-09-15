import { useState, useEffect, useCallback } from 'react'

import { getUsers, updateUser, deleteUser } from '@services/users'
import useAuth from '@hooks/useAuth'

import type { User, UpdateUserPayload } from '@services/users/types'

const useUsers = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getUsers({
        search: search || undefined,
        role: role || undefined
      })
      setUsers(response.rows || [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [search, role])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleClearFilters = () => {
    setSearch('')
    setRole('')
  }

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleCloseEdit = () => {
    setSelectedUser(null)
    setIsEditOpen(false)
  }

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleCloseDelete = () => {
    setSelectedUser(null)
    setIsDeleteOpen(false)
  }

  const handleUpdateUser = async (id: string, payload: UpdateUserPayload) => {
    setActionLoading(true)
    try {
      await updateUser(id, payload)
      handleCloseEdit()
      await fetchUsers()
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    setActionLoading(true)
    try {
      await deleteUser(id)
      handleCloseDelete()
      await fetchUsers()
    } finally {
      setActionLoading(false)
    }
  }

  return {
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
  }
}

export default useUsers
