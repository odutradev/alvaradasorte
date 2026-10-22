import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

import { SectionContainer, SectionHeader, ListContainer, ListItem, ItemHeaderRow, RowsContainer, SingleRowItem, TooltipContent, TooltipRow } from './styles'

import type { MatchedSectionProps } from './types'
import type { CsvRow } from '../../types'

const buildRowTooltip = (csvRow: CsvRow) => (
  <TooltipContent>
    {Object.entries(csvRow).map(([key, value]) => (
      <TooltipRow key={key}>
        <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>{key}:</Typography>
        <Typography variant="caption">{value || '—'}</Typography>
      </TooltipRow>
    ))}
  </TooltipContent>
)

const MatchedSection = ({ matched, valueColumn, onUndo, expectedValue, onViewReceipt }: MatchedSectionProps) => {
  if (!matched.length) return null

  return (
    <SectionContainer>
      <SectionHeader>
        <Typography variant="subtitle2" fontWeight={700}>✅ Confirmados</Typography>
        <Typography variant="caption" color="text.secondary">{matched.length}</Typography>
      </SectionHeader>
      <ListContainer>
        {matched.map((m) => {
          const expectedTotal = expectedValue * m.participation.count
          const diff = m.totalValue - expectedTotal
          const isValidValue = expectedValue > 0 ? Math.abs(diff) < 0.01 : true

          return (
            <ListItem key={m.participation.id}>
              <ItemHeaderRow>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {m.participation.userName} {m.participation.count > 1 ? `(${m.participation.count} cotas)` : ''}
                  </Typography>
                  <Link
                    component="button"
                    variant="caption"
                    underline="hover"
                    onClick={() => onViewReceipt(m.participation.receiptUrl, m.participation.userName)}
                  >
                    Ver comprovante
                  </Link>
                </Box>
                {isValidValue ? (
                  <Chip label={`R$ ${m.totalValue.toFixed(2)}`} size="small" color="success" variant="outlined" />
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Chip label={`Recebido: R$ ${m.totalValue.toFixed(2)}`} size="small" color="error" variant="outlined" />
                    <Chip
                      label={diff < 0 ? `Faltando: R$ ${Math.abs(diff).toFixed(2)}` : `A mais: R$ ${diff.toFixed(2)}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                )}
              </ItemHeaderRow>
              <RowsContainer>
                {m.rows.map((r) => (
                  <SingleRowItem key={r.originalRowIndex}>
                    <Tooltip title={buildRowTooltip(r.csvRow)} arrow placement="left">
                      <Typography variant="caption" color="text.secondary" sx={{ cursor: 'help' }}>
                        {r.csvRow[valueColumn] ? `R$ ${r.parsedValue.toFixed(2)}` : 'Sem valor'} • Similaridade: {(r.similarityScore * 100).toFixed(0)}%
                      </Typography>
                    </Tooltip>
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
}

export default MatchedSection
