import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { useRef, type ChangeEvent } from 'react'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Chip from '@mui/material/Chip'

import { UploadArea, ColumnSelectorsContent, ColumnSelectorsGrid, ResultsContent, SummaryChips, ResultsScrollContainer, ResultSection, ResultSectionHeader, ResultList, ResultItem, ResultItemMeta } from './styles'
import { useStatementValidation } from './useStatementValidation'

import type { MatchedParticipant, StatementValidationModalProps } from './types'
import type { ParticipationResponse } from '@services/sweepstakes/types'
import type { SelectChangeEvent } from '@mui/material'

const MatchedSection = ({ matched, valueColumn }: { matched: MatchedParticipant[]; valueColumn: string }) => (
  <ResultSection sectionColor="success">
    <ResultSectionHeader>
      <Typography variant="subtitle2" fontWeight={700}>✅ Pagaram</Typography>
      <Typography variant="caption" color="text.secondary">{matched.length}</Typography>
    </ResultSectionHeader>
    <ResultList>
      {matched.map((m) => (
        <ResultItem key={m.participation.id}>
          <Typography variant="body2">{m.participation.userName}</Typography>
          <ResultItemMeta>
            {m.csvRow[valueColumn] && (
              <Typography variant="caption" color="text.secondary">{m.csvRow[valueColumn]}</Typography>
            )}
            <Chip
              label={`${Math.round(m.similarityScore * 100)}%`}
              size="small"
              color="success"
              variant="outlined"
            />
          </ResultItemMeta>
        </ResultItem>
      ))}
    </ResultList>
  </ResultSection>
)

const UnmatchedSection = ({ unmatched }: { unmatched: ParticipationResponse[] }) => (
  <ResultSection sectionColor="error">
    <ResultSectionHeader>
      <Typography variant="subtitle2" fontWeight={700}>❌ Não Pagaram</Typography>
      <Typography variant="caption" color="text.secondary">{unmatched.length}</Typography>
    </ResultSectionHeader>
    <ResultList>
      {unmatched.map((p) => (
        <ResultItem key={p.id}>
          <Typography variant="body2">{p.userName}</Typography>
          <Chip label="Sem extrato" size="small" color="error" variant="outlined" />
        </ResultItem>
      ))}
    </ResultList>
  </ResultSection>
)

export const StatementValidationModal = ({ participations, open, onClose }: StatementValidationModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    step, csvHeaders, csvRowCount, nameColumn, valueColumn, result,
    setNameColumn, setValueColumn,
    handleFileUpload, handleValidate, handleReset
  } = useStatementValidation(participations)

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Validar Extrato</DialogTitle>
      <DialogContent dividers>
        {step === 'upload' && (
          <UploadArea onClick={() => inputRef.current?.click()}>
            <input ref={inputRef} type="file" accept=".csv" hidden onChange={handleFileChange} />
            <Typography variant="body1" fontWeight={500}>
              Clique para selecionar o CSV do extrato
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suporte a separadores vírgula (,) e ponto e vírgula (;) — codificação UTF-8
            </Typography>
          </UploadArea>
        )}
        {step === 'columns' && (
          <ColumnSelectorsContent>
            <Typography variant="body2" color="text.secondary">
              {csvRowCount} transações detectadas. Confirme as colunas para cruzar com os participantes.
            </Typography>
            <ColumnSelectorsGrid>
              <FormControl size="small" fullWidth>
                <InputLabel>Coluna do Nome</InputLabel>
                <Select
                  label="Coluna do Nome"
                  value={nameColumn}
                  onChange={(e: SelectChangeEvent<string>) => setNameColumn(e.target.value)}
                >
                  {csvHeaders.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Coluna do Valor</InputLabel>
                <Select
                  label="Coluna do Valor"
                  value={valueColumn}
                  onChange={(e: SelectChangeEvent<string>) => setValueColumn(e.target.value)}
                >
                  {csvHeaders.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                </Select>
              </FormControl>
            </ColumnSelectorsGrid>
          </ColumnSelectorsContent>
        )}
        {step === 'results' && result && (
          <ResultsContent>
            <SummaryChips>
              <Chip label={`${result.matched.length} pagaram`} color="success" size="small" />
              <Chip label={`${result.unmatched.length} não pagaram`} color="error" size="small" />
              <Chip label={`${result.unidentified.length} não identificados`} color="warning" size="small" />
            </SummaryChips>
            <ResultsScrollContainer>
              <MatchedSection matched={result.matched} valueColumn={valueColumn} />
              <UnmatchedSection unmatched={result.unmatched} />
              <ResultSection sectionColor="warning">
                <ResultSectionHeader>
                  <Typography variant="subtitle2" fontWeight={700}>⚠️ Não Identificados</Typography>
                  <Typography variant="caption" color="text.secondary">{result.unidentified.length}</Typography>
                </ResultSectionHeader>
                <ResultList>
                  {result.unidentified.map((row, i) => (
                    <ResultItem key={i}>
                      <Typography variant="body2">{row[nameColumn] ?? '—'}</Typography>
                      {row[valueColumn] && (
                        <Typography variant="caption" color="text.secondary">{row[valueColumn]}</Typography>
                      )}
                    </ResultItem>
                  ))}
                </ResultList>
              </ResultSection>
            </ResultsScrollContainer>
          </ResultsContent>
        )}
      </DialogContent>
      <DialogActions>
        {step === 'results' && (
          <Button onClick={handleReset} color="inherit" size="small">Nova Validação</Button>
        )}
        {step === 'columns' && (
          <Button onClick={handleValidate} variant="contained" color="primary">Validar</Button>
        )}
        <Button onClick={handleClose} color="inherit">Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}