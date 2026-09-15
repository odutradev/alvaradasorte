import CircularProgress from '@mui/material/CircularProgress'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import { StyledDialogContent } from './styles'

import type { EditUserModalProps } from './types'

const EditUserModal = ({ open, user, loading, onClose, onSubmit }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    email: '',
    department: '',
    phone: '',
    role: 'user' as 'admin' | 'user'
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        department: user.department ?? '',
        phone: user.phone ?? '',
        role: user.role ?? 'user'
      })
    }
  }, [user])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

    await onSubmit(user.id, formData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <StyledDialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nome de Exibição"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Nome Completo"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              fullWidth
            />
            <TextField
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Departamento"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              fullWidth
            />
            <TextField
              label="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="edit-user-role-label">Perfil de Acesso</InputLabel>
              <Select
                labelId="edit-user-role-label"
                value={formData.role}
                label="Perfil de Acesso"
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              >
                <MenuItem value="user">Usuário</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </StyledDialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditUserModal
