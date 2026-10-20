import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SearchIcon from '@mui/icons-material/Search'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useState, useEffect } from 'react'

import { addManualParticipation } from '@services/sweepstakes'
import { getUsers } from '@services/users'
import useAction from '@hooks/useAction'
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  UserListContainer,
  UserListItem,
  SelectedUserCard,
  QuotaSection
} from './styles'

import type { User } from '@services/users/types'
import type { AddParticipantModalProps } from './types'

const AddParticipantModal = ({ open, sweepstakeId, onClose, onSuccess }: AddParticipantModalProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [options, setOptions] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [quotaCount, setQuotaCount] = useState(1)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setSelectedUser(null)
    setSearchQuery('')
    setOptions([])
    setQuotaCount(1)
    setErrorMessage(null)
    onClose()
  }

  useEffect(() => {
    if (!open) {
      setSelectedUser(null)
      setSearchQuery('')
      setOptions([])
      setErrorMessage(null)
      setQuotaCount(1)
      return
    }

    let active = true
    setIsLoadingUsers(true)

    const timer = setTimeout(async () => {
      try {
        const response = await getUsers({
          search: searchQuery.trim() || undefined,
          limit: 6
        })
        if (active) {
          setOptions(response.data || [])
        }
      } catch {
        if (active) {
          setOptions([])
        }
      } finally {
        if (active) {
          setIsLoadingUsers(false)
        }
      }
    }, searchQuery ? 250 : 0)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [open, searchQuery])

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setErrorMessage(null)
  }

  const handleKeyDownSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && options.length > 0 && !selectedUser) {
      e.preventDefault()
      handleSelectUser(options[0])
    }
  }

  const handleSubmit = async () => {
    if (!selectedUser?.email) return

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await useAction({
        action: async () => {
          return await addManualParticipation(sweepstakeId, {
            email: selectedUser.email.trim(),
            quotaCount: Number(quotaCount) || 1
          })
        },
        callback: () => {
          handleClose()
          onSuccess()
        }
      })
    } catch (error: unknown) {
      const details = (error as { response?: { data?: { details?: string } } })?.response?.data?.details
      setErrorMessage(details || 'Ocorreu um erro ao adicionar o participante.')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 520,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <ModalHeader>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Adicionar Participante
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Busque pelo nome ou e-mail para selecionar um usuário cadastrado
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </ModalHeader>

      <ModalBody>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {!selectedUser ? (
          <>
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDownSearch}
              placeholder="Pesquisar por nome ou e-mail do usuário..."
              fullWidth
              autoFocus
              variant="outlined"
              size="medium"
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoadingUsers && <CircularProgress size={20} color="inherit" sx={{ mr: searchQuery ? 1 : 0 }} />}
                    {searchQuery && (
                      <IconButton size="small" onClick={() => setSearchQuery('')} edge="end">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                {searchQuery
                  ? `Resultados encontrados (${options.length})`
                  : 'Usuários cadastrados'}
              </Typography>
              {options.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Clique no usuário para selecionar
                </Typography>
              )}
            </Box>

            <UserListContainer>
              {isLoadingUsers && options.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="text.secondary">
                    Buscando participantes...
                  </Typography>
                </Box>
              ) : options.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1, textAlign: 'center' }}>
                  <PersonSearchIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.6 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Nenhum usuário encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                    {searchQuery
                      ? `Nenhum resultado corresponde a "${searchQuery}". Verifique a digitação ou cadastre o usuário.`
                      : 'Nenhum usuário cadastrado disponível.'}
                  </Typography>
                </Box>
              ) : (
                options.map((user) => (
                  <UserListItem key={user.id} onClick={() => handleSelectUser(user)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                      <Avatar
                        src={user.photoUrl}
                        alt={user.name}
                        sx={{ width: 42, height: 42, fontWeight: 600 }}
                      >
                        {(user.name || user.email)?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={600} noWrap>
                          {user.fullName || user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                      {user.department && (
                        <Chip
                          label={user.department}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
                        />
                      )}
                      <Button size="small" variant="text" color="primary">
                        Selecionar
                      </Button>
                    </Box>
                  </UserListItem>
                ))
              )}
            </UserListContainer>
          </>
        ) : (
          <>
            <SelectedUserCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                <Avatar
                  src={selectedUser.photoUrl}
                  alt={selectedUser.name}
                  sx={{ width: 56, height: 56, fontWeight: 700, fontSize: '1.25rem' }}
                >
                  {(selectedUser.name || selectedUser.email)?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" fontWeight={700} noWrap>
                    {selectedUser.fullName || selectedUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {selectedUser.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    {selectedUser.department && (
                      <Chip
                        label={selectedUser.department}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
                      />
                    )}
                    {selectedUser.phone && (
                      <Chip
                        label={selectedUser.phone}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Button
                variant="outlined"
                size="small"
                startIcon={<SwapHorizIcon />}
                onClick={() => setSelectedUser(null)}
                disabled={isSubmitting}
              >
                Trocar usuário
              </Button>
            </SelectedUserCard>

            <QuotaSection>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Quantidade de cotas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Defina o número de cotas atribuídas a este participante no bolão.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <IconButton
                  onClick={() => setQuotaCount((prev) => Math.max(1, prev - 1))}
                  disabled={quotaCount <= 1 || isSubmitting}
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}
                >
                  <RemoveIcon />
                </IconButton>

                <TextField
                  type="number"
                  value={quotaCount}
                  onChange={(e) => setQuotaCount(Math.max(1, Number(e.target.value)))}
                  size="small"
                  inputProps={{
                    min: 1,
                    style: { textAlign: 'center', width: 64, fontWeight: 700, fontSize: '1.2rem' }
                  }}
                  disabled={isSubmitting}
                />

                <IconButton
                  onClick={() => setQuotaCount((prev) => prev + 1)}
                  disabled={isSubmitting}
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </QuotaSection>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!selectedUser || isSubmitting}
          sx={{ minWidth: 160 }}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar ao Bolão'}
        </Button>
      </ModalFooter>
    </Dialog>
  )
}

export default AddParticipantModal
