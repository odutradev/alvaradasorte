import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

import { SectionContainer, SectionHeader, ListContainer, ListItem, ItemHeaderRow, RowsContainer, SingleRowItem } from './styles'

import type { MatchedSectionProps } from './types'

const MatchedSection = ({ matched, valueColumn, onUndo, expectedValue }: MatchedSectionProps) => (
  <SectionContainer>
    <SectionHeader>
      <Typography variant="subtitle2" fontWeight={700}>✅ Confirmados</Typography>
      <Typography variant="caption" color="text.secondary">{matched.length}</Typography>
    </SectionHeader>
    <ListContainer>
      {matched.map((m) => {
        const isValidValue = expectedValue > 0 ? m.totalValue === (expectedValue * m.participation.count) : true

        return (
          <ListItem key={m.participation.id}>
            <ItemHeaderRow>
              <Typography variant="body2" fontWeight={600}>
                {m.participation.userName} {m.participation.count > 1 ? `(${m.participation.count} cotas)` : ''}
              </Typography>
              {isValidValue ? (
                <Chip label={`R$ ${m.totalValue.toFixed(2)}`} size="small" color="success" variant="outlined" />
              ) : (
                <Chip label={`Divergente: R$ ${m.totalValue.toFixed(2)}`} size="small" color="error" variant="outlined" />
              )}
            </ItemHeaderRow>
            <RowsContainer>
              {m.rows.map(r => (
                <SingleRowItem key={r.originalRowIndex}>
                  <Typography variant="caption" color="text.secondary">
                    {r.csvRow[valueColumn] ? `R$ ${r.parsedValue.toFixed(2)}` : 'Sem valor'} • Similaridade: {(r.similarityScore * 100).toFixed(0)}%
                  </Typography>
                  {r.isManual ? (
                    <Button size="small" color="error" onClick={() => onUndo(m.participation.id, r.originalRowIndex)} sx={{ fontSize: '0.65rem', minWidth: 'auto', p: '2px 4px' }}>
                      Desfazer
                    </Button>
                  ) : (
                    <Chip label="Automático" size="small" color="default" sx={{ height: 20, fontSize: '0.65rem' }} />
                  )}
                </SingleRowItem>
              ))}
            </RowsContainer>
          </ListItem>
        )
      })}
    </ListContainer>
  </SectionContainer>
)

export default MatchedSection