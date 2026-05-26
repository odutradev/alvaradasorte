import Typography from '@mui/material/Typography'

import { SectionContainer, SectionHeader, ListContainer, ListItem } from './styles'

import type { NegativeSectionProps } from './types'

const NegativeSection = ({ negatives, nameColumn, valueColumn }: NegativeSectionProps) => {
  if (!negatives.length) return null

  return (
    <SectionContainer>
      <SectionHeader>
        <Typography variant="subtitle2" fontWeight={700}>📉 Saídas / Negativos</Typography>
        <Typography variant="caption" color="text.secondary">{negatives.length}</Typography>
      </SectionHeader>
      <ListContainer>
        {negatives.map((item) => (
          <ListItem key={item.originalRowIndex}>
            <Typography variant="body2">{item.row[nameColumn] ?? '—'}</Typography>
            <Typography variant="body2" color="error.main" fontWeight={600}>
              {item.row[valueColumn]}
            </Typography>
          </ListItem>
        ))}
      </ListContainer>
    </SectionContainer>
  )
}

export default NegativeSection