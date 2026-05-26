import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'

import { SectionContainer, SectionHeader, ListContainer, ListItem, ItemMeta } from './styles'

import type { SelectChangeEvent } from '@mui/material/Select'
import type { UnidentifiedSectionProps } from './types'

const UnidentifiedSection = ({ unidentified, unmatched, nameColumn, valueColumn, onLink }: UnidentifiedSectionProps) => {
  if (!unidentified.length) return null

  return (
    <SectionContainer>
      <SectionHeader>
        <Typography variant="subtitle2" fontWeight={700}>⚠️ Não Identificados</Typography>
        <Typography variant="caption" color="text.secondary">{unidentified.length}</Typography>
      </SectionHeader>
      <ListContainer>
        {unidentified.map((item) => (
          <ListItem key={item.originalRowIndex}>
            <Typography variant="body2">{item.row[nameColumn] ?? '—'}</Typography>
            <ItemMeta>
              <Typography variant="caption" color="text.secondary">
                {item.row[valueColumn] ? `R$ ${item.parsedValue.toFixed(2)}` : ''}
              </Typography>
              <Chip label="não identificado" size="small" color="warning" variant="outlined" />
              <Select
                size="small"
                value=""
                displayEmpty
                disabled={unmatched.length === 0}
                onChange={(e: SelectChangeEvent<string>) => onLink(e.target.value, item.originalRowIndex)}
                sx={{ minWidth: 140, height: 28, fontSize: '0.75rem' }}
              >
                <MenuItem value="" disabled>Vincular a...</MenuItem>
                {unmatched.map((u) => (
                  <MenuItem key={u.id} value={u.id} sx={{ fontSize: '0.75rem' }}>
                    {u.userName}
                  </MenuItem>
                ))}
              </Select>
            </ItemMeta>
          </ListItem>
        ))}
      </ListContainer>
    </SectionContainer>
  )
}

export default UnidentifiedSection