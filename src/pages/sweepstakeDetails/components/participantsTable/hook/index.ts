import { useState } from 'react'

import { deleteParticipation } from '@services/sweepstakes'
import { capitalizeWords } from '@utils/string'
import useAction from '@hooks/useAction'

import type { UseParticipantsTableProps } from './types'
import type { ExtendedParticipation } from '../types'

const useParticipantsTable = ({ participations, sweepstakeId, onUpdate }: UseParticipantsTableProps) => {
  const [editingParticipation, setEditingParticipation] = useState<ExtendedParticipation | null>(null)
  const [deletingParticipation, setDeletingParticipation] = useState<ExtendedParticipation | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isValidationOpen, setIsValidationOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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

  const handleDeleteConfirm = async () => {
    if (!deletingParticipation || !sweepstakeId) return

    setIsDeleting(true)

    await useAction({
      action: async () => {
        await deleteParticipation(sweepstakeId, deletingParticipation.id)
      },
      callback: () => {
        setDeletingParticipation(null)
        onUpdate?.()
      }
    })

    setIsDeleting(false)
  }

  const handleCopyList = () => {
    const totalQuotas = sortedParticipations.reduce((acc, part) => acc + (part.quotaCount ?? 1), 0)
    const listLines = sortedParticipations.map((part, index) => {
      const count = part.quotaCount ?? 1
      const quotaText = `${count} ${count === 1 ? 'cota' : 'cotas'}`
      const sector = part.userDepartment || part.userSector || part.sector || ''
      const sectorSuffix = sector ? ` - ${capitalizeWords(sector)}` : ''
      return `${index + 1}. ${capitalizeWords(part.userName)} (${quotaText})${sectorSuffix}`
    })
    const textToCopy = [`Total de cotas: ${totalQuotas}`, '', ...listLines].join('\n')

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
    } catch {}

    document.body.removeChild(textarea)
  }

  return {
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
  }
}

export default useParticipantsTable
