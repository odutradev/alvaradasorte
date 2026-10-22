import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useState } from 'react'

import { SectionContainer, SectionHeader, ListContainer, ListItem } from './styles'

import type { GroupedParticipation } from '../../types'
import type { UnmatchedSectionProps } from './types'

const buildCopyText = (unmatched: GroupedParticipation[]): string =>
  unmatched
    .map((p, i) => {
      const quotas = p.count === 1 ? '1 cota' : `${p.count} cotas`
      const suffix = p.userDepartment
        ? ` - ${p.userDepartment} (${quotas})`
        : ` (${quotas})`
      return `${i + 1}. ${p.userName}${suffix}`
    })
    .join('\n')

const UnmatchedSection = ({ unmatched, onViewReceipt }: UnmatchedSectionProps) => {
  const [isCopied, setIsCopied] = useState(false)

  if (!unmatched.length) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopyText(unmatched))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <Typography variant="subtitle2" fontWeight={700}>❌ Pendentes</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">{unmatched.length}</Typography>
          <Tooltip title={isCopied ? 'Copiado!' : 'Copiar lista (nome - setor - cotas)'}>
            <IconButton size="small" onClick={handleCopy} sx={{ p: 0.25 }}>
              {isCopied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </SectionHeader>
      <ListContainer>
        {unmatched.map((p) => (
          <ListItem key={p.id}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body2">
                {p.userName} {p.count > 1 ? `(${p.count} cotas)` : ''}
              </Typography>
              <Link
                component="button"
                variant="caption"
                underline="hover"
                onClick={() => onViewReceipt(p.receiptUrl, p.userName)}
              >
                Ver comprovante
              </Link>
            </Box>
            <Chip label="não pagou" size="small" color="error" variant="outlined" />
          </ListItem>
        ))}
      </ListContainer>
    </SectionContainer>
  )
}

export default UnmatchedSection
