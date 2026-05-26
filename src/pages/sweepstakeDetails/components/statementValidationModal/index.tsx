import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Chip from '@mui/material/Chip'
import { useRef } from 'react'

import { UploadArea, ColumnSelectorsContent, ColumnSelectorsGrid, ResultsContent, SummaryChips, ResultsScrollContainer, ResultSection, ResultSectionHeader, ResultList, ResultItem, ResultItemMeta } from './styles'
import useStatementValidation from './hook'

import type { MatchedParticipant, StatementValidationModalProps, UnidentifiedRow } from './types'
import type { ParticipationResponse } from '@services/sweepstakes/types'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ChangeEvent } from 'react'

const MatchedSection = ({ matched, valueColumn, onUndo }: { matched: MatchedParticipant[]; valueColumn: string; onUndo: (id: string) => void }) => (
  <ResultSection sectionColor="success">
    <ResultSectionHeader>
      <Typography variant="subtitle2" fontWeight={700}>✅ Confirmados</Typography>
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
            {m.isManual ? (
              <>
                <Chip label="pagou (seleção manual)" size="small" color="info" variant="outlined" />
                <Button size="small" color="error" onClick={() => onUndo(m.participation.id)}>
                  Desfazer
                </Button>
              </>
            ) : (
              <Chip label="pagou" size="small" color="success" variant="outlined" />
            )}
          </ResultItemMeta>
        </ResultItem>
      ))}
    </ResultList>
  </ResultSection>
)

const UnmatchedSection = ({ unmatched }: { unmatched: ParticipationResponse[] }) => (
  <ResultSection sectionColor="error">
    <ResultSectionHeader>
      <Typography variant="subtitle2" fontWeight={700}>❌ Pendentes</Typography>
      <Typography variant="caption" color="text.secondary">{unmatched.length}</Typography>
    </ResultSectionHeader>
    <ResultList>
      {unmatched.map((p) => (
        <ResultItem key={p.id}>
          <Typography variant="body2">{p.userName}</Typography>
          <Chip label="não pagou" size="small" color="error" variant="outlined" />
        </ResultItem>
      ))}
    </ResultList>
  </ResultSection>
)

const UnidentifiedSection = ({
  unidentified,
  unmatched,
  nameColumn,
  valueColumn,
  onLink
}: {
  unidentified: UnidentifiedRow[]
  unmatched: ParticipationResponse[]
  nameColumn: string
  valueColumn: string
  onLink: (participationId: string, rowIndex: number) => void
}) => (
  <ResultSection sectionColor="warning">
    <ResultSectionHeader>
      <Typography variant="subtitle2" fontWeight={700}>⚠️ Não Identificados</Typography>
      <Typography variant="caption" color="text.secondary">{unidentified.length}</Typography>
    </ResultSectionHeader>
    <ResultList>
      {unidentified.map((item) => (
        <ResultItem key={item.originalRowIndex}>
          <Typography variant="body2">{item.row[nameColumn] ?? '—'}</Typography>
          <ResultItemMeta>
            {item.row[valueColumn] && (
              <Typography variant="caption" color="text.secondary">{item.row[valueColumn]}</Typography>
            )}
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
          </ResultItemMeta>
        </ResultItem>
      ))}
    </ResultList>
  </ResultSection>
)

const StatementValidationModal = ({ participations, open, onClose }: StatementValidationModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    step,
    result,
    nameColumn,
    csvHeaders,
    csvRowCount,
    valueColumn,
    handleReset,
    setNameColumn,
    setValueColumn,
    handleValidate,
    handleUndoLink,
    handleFileUpload,
    handleManualLink
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
                  {csvHeaders.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Coluna do Valor</InputLabel>
                <Select
                  label="Coluna do Valor"
                  value={valueColumn}
                  onChange={(e: SelectChangeEvent<string>) => setValueColumn(e.target.value)}
                >
                  {csvHeaders.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ColumnSelectorsGrid>
          </ColumnSelectorsContent>
        )}
        {step === 'results' && result && (
          <ResultsContent>
            <SummaryChips>
              <Chip label={`${result.matched.length} confirmados`} color="success" size="small" />
              <Chip label={`${result.unmatched.length} pendentes`} color="error" size="small" />
              <Chip label={`${result.unidentified.length} não identificados`} color="warning" size="small" />
            </SummaryChips>
            <ResultsScrollContainer>
              <MatchedSection matched={result.matched} valueColumn={valueColumn} onUndo={handleUndoLink} />
              <UnmatchedSection unmatched={result.unmatched} />
              <UnidentifiedSection
                unidentified={result.unidentified}
                unmatched={result.unmatched}
                nameColumn={nameColumn}
                valueColumn={valueColumn}
                onLink={handleManualLink}
              />
            </ResultsScrollContainer>
          </ResultsContent>
        )}
      </DialogContent>
      <DialogActions>
        {step === 'results' && (
          <Button onClick={handleReset} color="inherit" size="small">
            Nova Validação
          </Button>
        )}
        {step === 'columns' && (
          <Button onClick={handleValidate} variant="contained" color="primary">
            Validar
          </Button>
        )}
        <Button onClick={handleClose} color="inherit">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StatementValidationModal