import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

import { SectionContainer, SectionHeader, ListContainer, ListItem } from './styles'

import type { UnmatchedSectionProps } from './types'

const UnmatchedSection = ({ unmatched, onViewReceipt }: UnmatchedSectionProps) => {
  if (!unmatched.length) return null

  return (
    <SectionContainer>
      <SectionHeader>
        <Typography variant="subtitle2" fontWeight={700}>❌ Pendentes</Typography>
        <Typography variant="caption" color="text.secondary">{unmatched.length}</Typography>
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