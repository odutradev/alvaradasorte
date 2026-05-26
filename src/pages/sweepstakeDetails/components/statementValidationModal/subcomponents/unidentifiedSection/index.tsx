import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useState } from 'react'

import { SectionContainer, SectionHeader, ListContainer, ListItem, ItemMeta } from './styles'

import type { SelectChangeEvent } from '@mui/material/Select'
import type { UnidentifiedSectionProps } from './types'
import type { UnidentifiedRow } from '../../types'

const buildCopyText = (unidentified: UnidentifiedRow[], nameColumn: string): string =>
  unidentified
    .map((u, i) => `${i + 1}. ${u.row[nameColumn] ?? '—'}`)
    .join('\n')

const UnidentifiedSection = ({ unidentified, unmatched, nameColumn, valueColumn, onLink }: UnidentifiedSectionProps) => {
  const [isCopied, setIsCopied] = useState(false)

  if (!unidentified.length) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopyText(unidentified, nameColumn))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <Typography variant="subtitle2" fontWeight={700}>⚠️ Não Identificados</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">{unidentified.length}</Typography>
          <Tooltip title={isCopied ? 'Copiado!' : 'Copiar lista (nomes)'}>
            <IconButton size="small" onClick={handleCopy} sx={{ p: 0.25 }}>
              {isCopied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
            </IconButton>
          </Tooltip>
        </Box>
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
