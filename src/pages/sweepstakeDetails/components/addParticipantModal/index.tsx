import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Autocomplete from '@mui/material/Autocomplete'
import DialogTitle from '@mui/material/DialogTitle'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useState, useEffect } from 'react'

import { addManualParticipation } from '@services/sweepstakes'
import { FormContainer, SelectedUserCard } from './styles'
import { getUsers } from '@services/users'
import useAction from '@hooks/useAction'

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
          limit: 10
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
    }, searchQuery ? 300 : 0)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [open, searchQuery])

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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Participante</DialogTitle>
      <DialogContent dividers>
        <FormContainer>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Autocomplete
            openOnFocus
            autoHighlight
            options={options}
            loading={isLoadingUsers}
            value={selectedUser}
            onChange={(_, newValue) => {
              setSelectedUser(newValue)
              setErrorMessage(null)
            }}
            inputValue={searchQuery}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === 'reset') return
              setSearchQuery(newInputValue)
            }}
            getOptionLabel={(option) => option.fullName || option.name || option.email}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x) => x}
            noOptionsText={isLoadingUsers ? 'Buscando usuários...' : 'Nenhum usuário encontrado'}
            disabled={isSubmitting}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props
              return (
                <Box
                  component="li"
                  key={key || option.id}
                  {...otherProps}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}
                >
                  <Avatar
                    src={option.photoUrl}
                    alt={option.name}
                    sx={{ width: 36, height: 36, fontSize: 14 }}
                  >
                    {(option.name || option.email)?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {option.fullName || option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {option.email}
                    </Typography>
                  </Box>
                  {option.department && (
                    <Chip label={option.department} size="small" variant="outlined" />
                  )}
                </Box>
              )
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pesquisar participante"
                placeholder="Digite o nome ou e-mail..."
                size="small"
                fullWidth
                autoFocus
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {isLoadingUsers ? <CircularProgress color="inherit" size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />

          {selectedUser && (
            <SelectedUserCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Avatar
                  src={selectedUser.photoUrl}
                  alt={selectedUser.name}
                  sx={{ width: 42, height: 42 }}
                >
                  {(selectedUser.name || selectedUser.email)?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>
                    {selectedUser.fullName || selectedUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {selectedUser.email}
                  </Typography>
                  {selectedUser.department && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Departamento: {selectedUser.department}
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={() => setSelectedUser(null)}
                title="Remover seleção"
                disabled={isSubmitting}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </SelectedUserCard>
          )}

          <TextField
            label="Quantidade de cotas"
            type="number"
            size="small"
            fullWidth
            inputProps={{ min: 1 }}
            value={quotaCount}
            onChange={(e) => setQuotaCount(Math.max(1, Number(e.target.value)))}
            disabled={isSubmitting}
          />
        </FormContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!selectedUser || isSubmitting}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddParticipantModal

