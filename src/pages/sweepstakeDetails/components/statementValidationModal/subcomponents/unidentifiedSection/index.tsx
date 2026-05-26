import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from '@mui/icons-material/Search'
import CheckIcon from '@mui/icons-material/Check'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

import { SectionContainer, SectionHeader, ListContainer, ListItem, ItemMeta } from './styles'

import type { GroupedParticipation, UnidentifiedRow } from '../../types'
import type { UnidentifiedSectionProps } from './types'

const buildCopyText = (unidentified: UnidentifiedRow[], nameColumn: string): string =>
  unidentified
    .map((u, i) => `${i + 1}. ${u.row[nameColumn] ?? '—'}`)
    .join('\n')

interface LinkSelectInputProps {
  unmatched: GroupedParticipation[]
  rowIndex: number
  onLink: (participationId: string, rowIndex: number) => void
}

const LinkSelectInput = ({ unmatched, rowIndex, onLink }: LinkSelectInputProps) => {
  const [inputValue, setInputValue] = useState('')

  return (
    <Autocomplete
      options={unmatched}
      getOptionLabel={(option) => option.userName}
      inputValue={inputValue}
      value={null}
      noOptionsText="Sem opções"
      disabled={unmatched.length === 0}
      onInputChange={(_, value, reason) => {
        if (reason === 'reset') return
        setInputValue(value)
      }}
      onChange={(_, value) => {
        if (!value) return
        onLink(value.id, rowIndex)
        setInputValue('')
      }}
      sx={{ minWidth: 180 }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Vincular a..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16 }} />
              </InputAdornment>
            )
          }}
        />
      )}
    />
  )
}

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
              <LinkSelectInput unmatched={unmatched} rowIndex={item.originalRowIndex} onLink={onLink} />
            </ItemMeta>
          </ListItem>
        ))}
      </ListContainer>
    </SectionContainer>
  )
}

export default UnidentifiedSection
