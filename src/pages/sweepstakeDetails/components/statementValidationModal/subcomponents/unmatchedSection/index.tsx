import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

import { SectionContainer, SectionHeader, ListContainer, ListItem } from './styles'

import type { UnmatchedSectionProps } from './types'

const UnmatchedSection = ({ unmatched }: UnmatchedSectionProps) => {
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
            <Typography variant="body2">
              {p.userName} {p.count > 1 ? `(${p.count} cotas)` : ''}
            </Typography>
            <Chip label="não pagou" size="small" color="error" variant="outlined" />
          </ListItem>
        ))}
      </ListContainer>
    </SectionContainer>
  )
}

export default UnmatchedSection