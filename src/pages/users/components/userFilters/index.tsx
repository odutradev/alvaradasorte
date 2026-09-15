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
import Button from '@mui/material/Button'

import { FiltersContainer, SearchWrapper } from './styles'

import type { UserFiltersProps } from './types'

const UserFilters = ({ search, role, onSearchChange, onRoleChange, onClearFilters }: UserFiltersProps) => {
  const hasActiveFilters = Boolean(search || role)

  return (
    <FiltersContainer elevation={0}>
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
                <IconButton size="small" onClick={() => onSearchChange('')} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
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
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="user">Usuário</MenuItem>
        </Select>
      </FormControl>
      {hasActiveFilters && (
        <Button variant="outlined" color="secondary" size="small" onClick={onClearFilters} startIcon={<ClearIcon />}>
          Limpar
        </Button>
      )}
    </FiltersContainer>
  )
}

export default UserFilters
