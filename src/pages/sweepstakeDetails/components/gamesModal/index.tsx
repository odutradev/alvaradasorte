import { useState } from 'react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CasinoIcon from '@mui/icons-material/Casino'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import {
  ModalContainer,
  NumberGrid,
  NumberBall,
  GamesSection,
  GamesListContainer,
  GameRow,
  NumbersContainer,
  NumberChip,
  ResultSection,
  ResultCard
} from './styles'
import { getLotteryMeta } from '@services/lotteries'
import { getGamePrice } from '@utils/lotteryRules'
import { formatCurrency } from '@utils/string'
import ResultSyncStatus from '../resultSyncStatus'
import Modal from '@components/modal'
import useGamesModal from './hook'

import type { GamesModalProps } from './types'

export const GamesModal = ({ sweepstake, onUpdate, open, onClose }: GamesModalProps) => {
  const {
    games,
    selectedNumbers,
    targetCount,
    lotteryType,
    rule,
    availableBudget,
    totalCurrentCost,
    balance,
    allocationSuggestion,
    newGameInput,
    resultInput,
    resultNumbers,
    isSavingGames,
    isSavingResult,
    isFetchingCaixaResult,
    setNewGameInput,
    setResultInput,
    setTargetCount,
    toggleNumber,
    toggleResultNumber,
    clearResultNumbers,
    handleFetchCaixaResult,
    generateSurpresinha,
    clearSelectedNumbers,
    addCurrentGame,
    addGameFromInput,
    removeGame,
    clearAllGames,
    applySuggestion,
    handleSaveGames,
    handleSaveResult,
    getMatchedNumbers,
    getHitsCount
  } = useGamesModal(sweepstake, open, onUpdate)

  const [mainTab, setMainTab] = useState<'games' | 'result'>('games')
  const [inputMode, setInputMode] = useState<'wheel' | 'text'>('wheel')

  const lotteryMeta = getLotteryMeta(lotteryType)
  const lotteryColor = lotteryMeta?.color || '#209869'
  const availableNumbers = Array.from({ length: rule.totalNumbers }, (_, i) => i + 1)
  const selectableTargetCounts = Object.keys(rule.prices).map(Number).sort((a, b) => a - b)
  const isCurrentGameComplete = selectedNumbers.length === targetCount
  const currentWheelPrice = getGamePrice(lotteryType, targetCount)

  return (
    <Modal
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      paperSx={{
        width: '95vw',
        maxWidth: '95vw',
        height: '95vh',
        maxHeight: '95vh !important'
      }}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={700}>
            Jogos & Resultado
          </Typography>
          <Chip
            label={lotteryMeta?.name || lotteryType.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: lotteryColor,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}
          />
          {sweepstake.contestNumber && (
            <Chip
              label={`Concurso #${sweepstake.contestNumber}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />
          )}
        </Box>
      }
      actions={
        <Button onClick={onClose} color="inherit">
          Fechar
        </Button>
      }
    >
      <ModalContainer sx={{ gap: 2 }}>
        {/* Navegação Simplificada por Abas */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={mainTab}
            onChange={(_, val) => setMainTab(val)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              value="games"
              label={`Jogos do Bolão (${games.length})`}
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            />
            <Tab
              value="result"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Resultado & Apuração</span>
                  {resultNumbers.length > 0 && (
                    <Chip
                      size="small"
                      color="success"
                      label={`${resultNumbers.length} dezenas`}
                      sx={{ height: 18, fontSize: '0.6875rem', fontWeight: 700 }}
                    />
                  )}
                </Box>
              }
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            />
          </Tabs>
        </Box>

        {/* ABA 1: JOGOS DO BOLÃO */}
        {mainTab === 'games' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Barra Financeira Minimalista */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Arrecadado: <strong style={{ color: '#fff' }}>{formatCurrency(availableBudget)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gasto: <strong>{formatCurrency(totalCurrentCost)}</strong>
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={balance >= 0 ? 'success.main' : 'error.main'}
                >
                  Saldo: {formatCurrency(balance)}
                </Typography>
              </Box>

              {allocationSuggestion.allocations.length > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CasinoIcon fontSize="small" />}
                  onClick={applySuggestion}
                  sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem', py: 0.25 }}
                >
                  Sugerir Jogos ({allocationSuggestion.totalGamesCount})
                </Button>
              )}
            </Box>

            {/* Inserção de Jogo Simplificada */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                {/* Seletor de dezenas */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                    Dezenas:
                  </Typography>
                  {selectableTargetCounts.map((count) => {
                    const isSelected = targetCount === count
                    const price = rule.prices[String(count)]
                    return (
                      <Chip
                        key={count}
                        label={`${count} (${formatCurrency(price)})`}
                        size="small"
                        clickable
                        onClick={() => setTargetCount(count)}
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{ height: 22, fontSize: '0.6875rem', fontWeight: isSelected ? 700 : 500 }}
                      />
                    )
                  })}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    onClick={() => setInputMode((prev) => (prev === 'wheel' ? 'text' : 'wheel'))}
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                  >
                    {inputMode === 'wheel' ? 'Digitar em lote' : 'Usar volante'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CasinoIcon fontSize="small" />}
                    onClick={generateSurpresinha}
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                  >
                    Surpresinha
                  </Button>
                  {inputMode === 'wheel' && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon fontSize="small" />}
                      onClick={addCurrentGame}
                      disabled={!isCurrentGameComplete}
                      sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      Adicionar ({formatCurrency(currentWheelPrice)})
                    </Button>
                  )}
                </Box>
              </Box>

              {inputMode === 'wheel' ? (
                <NumberGrid sx={{ maxHeight: 180, p: 1, gap: 0.5 }}>
                  {availableNumbers.map((num) => {
                    const isSelected = selectedNumbers.includes(num)
                    return (
                      <NumberBall
                        key={num}
                        selected={isSelected}
                        badgeColor={lotteryColor}
                        onClick={() => toggleNumber(num)}
                        sx={{ minWidth: 32, width: 32, height: 32, fontSize: '0.75rem' }}
                      >
                        {num < 10 ? `0${num}` : num}
                      </NumberBall>
                    )
                  })}
                </NumberGrid>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Ex: 04, 12, 23, 31, 45, 58 (ou um por linha)"
                    value={newGameInput}
                    onChange={(e) => setNewGameInput(e.target.value)}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={addGameFromInput}
                    disabled={!newGameInput.trim()}
                    sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                  >
                    Adicionar
                  </Button>
                </Box>
              )}
            </Box>

            {/* Lista Enxuta de Jogos Cadastrados */}
            <GamesSection sx={{ gap: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Jogos Cadastrados ({games.length})
                </Typography>
                {games.length > 0 && (
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={clearAllGames}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0 }}
                  >
                    Limpar todos
                  </Button>
                )}
              </Box>

              {games.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  Nenhum jogo cadastrado ainda. Use o volante ou surpresinha acima.
                </Typography>
              ) : (
                <GamesListContainer sx={{ maxHeight: 240 }}>
                  {games.map((game, index) => {
                    const gamePrice = getGamePrice(lotteryType, game.length)
                    const hits = getHitsCount(game)
                    return (
                      <GameRow key={index} sx={{ py: 0.75, px: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ minWidth: 24 }}>
                          #{index + 1}
                        </Typography>

                        <NumbersContainer sx={{ gap: 0.5 }}>
                          {getMatchedNumbers(game).map((entry, i) => (
                            <NumberChip
                              key={i}
                              matched={entry.matched}
                              sx={{ width: 26, height: 26, fontSize: '0.75rem' }}
                            >
                              {entry.number < 10 ? `0${entry.number}` : entry.number}
                            </NumberChip>
                          ))}
                        </NumbersContainer>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {hits > 0 && (
                            <Chip
                              size="small"
                              color="success"
                              label={`${hits} acertos`}
                              sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700 }}
                            />
                          )}
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {formatCurrency(gamePrice)}
                          </Typography>
                          <Tooltip title="Excluir">
                            <IconButton size="small" onClick={() => removeGame(index)} color="error" sx={{ p: 0.25 }}>
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </GameRow>
                    )
                  })}
                </GamesListContainer>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveGames}
                  disabled={isSavingGames || !games.length}
                  sx={{ textTransform: 'none', px: 3, borderRadius: 2, fontWeight: 700 }}
                >
                  {isSavingGames ? 'Salvando...' : 'Salvar Jogos'}
                </Button>
              </Box>
            </GamesSection>
          </Box>
        )}

        {/* ABA 2: RESULTADO DO SORTEIO */}
        {mainTab === 'result' && (
          <ResultSection sx={{ gap: 2 }}>
            <ResultSyncStatus sweepstake={sweepstake} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Dezenas Sorteadas ({rule.minNumbers} números)
              </Typography>

              <Button
                variant="contained"
                size="small"
                startIcon={isFetchingCaixaResult ? <CircularProgress size={14} color="inherit" /> : <CloudDownloadIcon fontSize="small" />}
                onClick={handleFetchCaixaResult}
                disabled={isFetchingCaixaResult}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: '#ffffff'
                }}
              >
                {isFetchingCaixaResult ? 'Buscando...' : 'Buscar Resultado na Caixa'}
              </Button>
            </Box>

            <ResultCard elevation={0} sx={{ p: 1.5, gap: 1.5 }}>
              {/* Dezenas Sorteadas Selecionadas */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {resultNumbers.length} de {rule.minNumbers} dezenas
                  </Typography>
                  {resultNumbers.length === rule.minNumbers && (
                    <Chip size="small" color="success" label="Completo" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700 }} />
                  )}
                </Box>

                {resultNumbers.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    startIcon={<RestartAltIcon fontSize="small" />}
                    onClick={clearResultNumbers}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0 }}
                  >
                    Limpar
                  </Button>
                )}
              </Box>

              {/* Volante de Dezenas para Marcação Rápida */}
              <NumberGrid sx={{ maxHeight: 180, p: 1, gap: 0.5 }}>
                {availableNumbers.map((num) => {
                  const isSelected = resultNumbers.includes(num)
                  return (
                    <NumberBall
                      key={num}
                      selected={isSelected}
                      badgeColor="#16a34a"
                      onClick={() => toggleResultNumber(num)}
                      sx={{ minWidth: 32, width: 32, height: 32, fontSize: '0.75rem' }}
                    >
                      {num < 10 ? `0${num}` : num}
                    </NumberBall>
                  )
                })}
              </NumberGrid>

              {/* Entrada por Texto Opcional */}
              <TextField
                size="small"
                fullWidth
                label="Ou digite separadas por vírgula"
                placeholder="Ex: 04, 12, 23, 31, 45, 58"
                value={resultInput}
                onChange={(e) => setResultInput(e.target.value)}
              />
            </ResultCard>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon fontSize="small" />}
                onClick={handleSaveResult}
                disabled={isSavingResult || !resultNumbers.length}
                sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, px: 3 }}
              >
                {isSavingResult ? 'Salvando...' : 'Salvar Resultado'}
              </Button>
            </Box>
          </ResultSection>
        )}
      </ModalContainer>
    </Modal>
  )
}

export default GamesModal