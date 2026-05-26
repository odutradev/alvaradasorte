import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputAdornment from '@mui/material/InputAdornment'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import SearchIcon from '@mui/icons-material/Search'
import CheckIcon from '@mui/icons-material/Check'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import { useRef, useState } from 'react'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

import { UploadArea, ColumnSelectorsContent, ColumnSelectorsGrid, ResultsContent, SearchContainer, SummaryChips, ResultsScrollContainer } from './styles'
import UnidentifiedSection from './subcomponents/unidentifiedSection'
import UnmatchedSection from './subcomponents/unmatchedSection'
import NegativeSection from './subcomponents/negativeSection'
import MatchedSection from './subcomponents/matchedSection'
import useStatementValidation from './hook'

import type { StatementValidationModalProps, GroupedParticipation, UnidentifiedRow, MatchedParticipant } from './types'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ChangeEvent } from 'react'

const buildParticipantLabel = (userName: string, userDepartment: string, count: number): string => {
  const quotas = count === 1 ? '1 cota' : `${count} cotas`
  return userDepartment
    ? `${userName} - ${userDepartment} (${quotas})`
    : `${userName} (${quotas})`
}

const buildFullCopyText = (matched: MatchedParticipant[], unmatched: GroupedParticipation[], unidentified: UnidentifiedRow[], nameColumn: string): string => {
  const toMatchedLine = (m: MatchedParticipant, i: number) =>
    `${i + 1}. ${buildParticipantLabel(m.participation.userName, m.participation.userDepartment, m.participation.count)}`

  const toUnmatchedLine = (p: GroupedParticipation, i: number) =>
    `${i + 1}. ${buildParticipantLabel(p.userName, p.userDepartment, p.count)}`

  const toUnidentifiedLine = (u: UnidentifiedRow, i: number) =>
    `${i + 1}. ${u.row[nameColumn] ?? '—'}`

  const sections = [
    matched.length ? ['=== PAGAMENTO CONFIRMADO ===', ...matched.map(toMatchedLine)] : [],
    unmatched.length ? ['=== PAGAMENTO PENDENTE ===', ...unmatched.map(toUnmatchedLine)] : [],
    unidentified.length ? ['=== TRANSAÇÃO FORA DO FORMULÁRIO ===', ...unidentified.map(toUnidentifiedLine)] : []
  ].filter((s) => s.length > 0)

  return sections.map((s) => s.join('\n')).join('\n\n')
}

const StatementValidationModal = ({ participations, quotaPrice, open, onClose }: StatementValidationModalProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    estimatedQuotaPrice,
    setSelectedReceipt,
    selectedReceipt,
    handleManualLink,
    handleFileUpload,
    filteredResult,
    handleUndoLink,
    handleValidate,
    setSearchQuery,
    setValueColumn,
    setNameColumn,
    searchQuery,
    csvRowCount,
    valueColumn,
    handleReset,
    csvHeaders,
    nameColumn,
    result,
    step
  } = useStatementValidation(participations, quotaPrice)

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleViewReceipt = (url: string, name: string) => {
    setSelectedReceipt({ url, name })
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(buildFullCopyText(result.matched, result.unmatched, result.unidentified, nameColumn))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle>Validar Extrato</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
        {step === 'results' && filteredResult && (
          <ResultsContent>
            <SearchContainer>
              <TextField
                placeholder="Pesquisar participante ou descrição..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <SummaryChips>
                <Chip label={`${filteredResult.matched.length} confirmados`} color="success" size="small" />
                <Chip label={`${filteredResult.unmatched.length} pendentes`} color="error" size="small" />
                <Chip label={`${filteredResult.unidentified.length} não identificados`} color="warning" size="small" />
                {filteredResult.negatives.length > 0 && (
                  <Chip label={`${filteredResult.negatives.length} saídas`} color="default" size="small" />
                )}
              </SummaryChips>
            </SearchContainer>
            <ResultsScrollContainer>
              <MatchedSection
                matched={filteredResult.matched}
                valueColumn={valueColumn}
                onUndo={handleUndoLink}
                expectedValue={estimatedQuotaPrice}
                onViewReceipt={handleViewReceipt}
              />
              <UnmatchedSection unmatched={filteredResult.unmatched} onViewReceipt={handleViewReceipt} />
              <UnidentifiedSection
                unidentified={filteredResult.unidentified}
                unmatched={filteredResult.unmatched}
                nameColumn={nameColumn}
                valueColumn={valueColumn}
                onLink={handleManualLink}
              />
              <NegativeSection
                negatives={filteredResult.negatives}
                nameColumn={nameColumn}
                valueColumn={valueColumn}
              />
            </ResultsScrollContainer>
          </ResultsContent>
        )}
      </DialogContent>
      <DialogActions>
        {step === 'results' && result && (
          <Box sx={{ mr: 'auto' }}>
            <Tooltip title={isCopied ? 'Copiado!' : 'Copiar lista completa'}>
              <IconButton size="small" onClick={handleCopy}>
                {isCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        )}
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
      <Dialog open={!!selectedReceipt} onClose={() => setSelectedReceipt(null)} fullWidth maxWidth="sm">
        <DialogTitle>Comprovante - {selectedReceipt?.name}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Box
            component="img"
            src={selectedReceipt?.url ?? ''}
            alt="Comprovante"
            sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button href={selectedReceipt?.url ?? ''} target="_blank" rel="noreferrer" color="secondary">
            Abrir em nova aba
          </Button>
          <Button onClick={() => setSelectedReceipt(null)} color="primary">Fechar</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default StatementValidationModal
