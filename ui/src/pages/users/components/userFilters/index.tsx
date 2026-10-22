import InputAdornment from '@mui/material/InputAdornment'
import FilterListIcon from '@mui/icons-material/FilterList'
import FormControl from '@mui/material/FormControl'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { FiltersContainer, SearchWrapper } from './styles'

import type { UserFiltersProps } from './types'

const UserFilters = ({ search, role, onSearchChange, onRoleChange }: UserFiltersProps) => {
  return (
    <FiltersContainer>
      <SearchWrapper>
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar por nome ou e-mail..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange('')} edge="end" aria-label="Limpar pesquisa">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </SearchWrapper>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="role-filter-label">Perfil</InputLabel>
        <Select
          labelId="role-filter-label"
          id="role-filter"
          value={role}
          label="Perfil"
          onChange={(event) => onRoleChange(event.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <FilterListIcon fontSize="small" color="action" />
            </InputAdornment>
          }
          endAdornment={
            role ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onRoleChange('')
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                }}
                edge="end"
                aria-label="Limpar perfil"
                sx={{
                  position: 'absolute',
                  right: 28,
                  top: 'calc(50% - 14px)',
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <ClearIcon sx={{ fontSize: 18 }} />
              </IconButton>
            ) : null
          }
          sx={{
            borderRadius: 2,
            '& .MuiSelect-select': {
              pr: role ? '56px !important' : undefined
            }
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="user">Usuário</MenuItem>
        </Select>
      </FormControl>
    </FiltersContainer>
  )
}

export default UserFilters
