import { useState } from 'react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
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
  SuggestionCard,
  NumberGrid,
  NumberBall,
  GamesSection,
  GamesListContainer,
  QueueItemRow,
  SlotBall,
  NumbersContainer,
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
    queuedGames,
    activeGameId,
    activeGame,
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
    setActiveGameId,
    setNewGameInput,
    setResultInput,
    toggleNumber,
    toggleResultNumber,
    clearResultNumbers,
    handleFetchCaixaResult,
    generateSurpresinhaForActive,
    generateSurpresinhaForGame,
    fillAllPendingWithSurpresinha,
    clearActiveGame,
    clearGameById,
    addEmptyGameToQueue,
    addGameFromInput,
    removeGameFromQueue,
    clearAllQueuedGames,
    applySuggestionAsQueue,
    handleSaveGames,
    handleSaveResult,
    getMatchedNumbers,
    getHitsCount
  } = useGamesModal(sweepstake, open, onUpdate)

  const [mainTab, setMainTab] = useState<'games' | 'result'>('games')
  const [inputMode, setInputMode] = useState<'wheel' | 'text'>('wheel')
  const [newGameTargetCount, setNewGameTargetCount] = useState<number>(rule.minNumbers)

  const lotteryMeta = getLotteryMeta(lotteryType)
  const lotteryColor = lotteryMeta?.color || '#209869'
  const availableNumbers = Array.from({ length: rule.totalNumbers }, (_, i) => i + 1)
  const selectableTargetCounts = Object.keys(rule.prices).map(Number).sort((a, b) => a - b)

  const activeIndex = queuedGames.findIndex((g) => g.id === activeGameId)
  const completedGamesCount = queuedGames.filter((g) => g.numbers.length === g.targetCount).length
  const pendingGamesCount = queuedGames.length - completedGamesCount

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
        {/* Abas Principais */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={mainTab}
            onChange={(_, val) => setMainTab(val)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              value="games"
              label={`Fila de Jogos (${queuedGames.length})`}
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

        {/* ABA 1: FILA DE JOGOS & PREENCHIMENTO */}
        {mainTab === 'games' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Barra Financeira */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Arrecadado: <strong style={{ color: '#fff' }}>{formatCurrency(availableBudget)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total da Fila: <strong>{formatCurrency(totalCurrentCost)}</strong>
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={balance >= 0 ? 'success.main' : 'error.main'}
                >
                  Saldo: {formatCurrency(balance)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  size="small"
                  label={`${completedGamesCount} completos • ${pendingGamesCount} pendentes`}
                  color={pendingGamesCount === 0 && queuedGames.length > 0 ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }}
                />
              </Box>
            </Box>

            {/* CARD DE SUGESTÃO: Mostra quais jogos fazer e botão para criar a fila de preenchimento */}
            {allocationSuggestion.allocations.length > 0 && (
              <SuggestionCard elevation={0} sx={{ p: 2, gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesomeIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight={700} color="primary">
                      Sugestão Inteligente pelo Valor Arrecadado ({formatCurrency(availableBudget)})
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CasinoIcon fontSize="small" />}
                    onClick={applySuggestionAsQueue}
                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
                  >
                    Gerar Fila com Jogos Vazios ({allocationSuggestion.totalGamesCount} {allocationSuggestion.totalGamesCount === 1 ? 'jogo' : 'jogos'})
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Jogos calculados para o orçamento disponível. Ao clicar acima, os jogos entrarão vazios na fila para você preencher:
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allocationSuggestion.allocations.map((item, idx) => (
                    <Chip
                      key={idx}
                      size="small"
                      color="primary"
                      variant="outlined"
                      label={`${item.count}x jogo de ${item.numbersCount} dezenas (${formatCurrency(item.totalPrice)})`}
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                  {allocationSuggestion.remainingBudget > 0 && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`Sobra não alocada: ${formatCurrency(allocationSuggestion.remainingBudget)}`}
                    />
                  )}
                </Box>
              </SuggestionCard>
            )}

            {/* ÁREA DO VOLANTE: Preenche o jogo selecionado na fila */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {activeGame ? (
                    <>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Preenchendo Jogo #{activeIndex + 1} ({activeGame.targetCount} dezenas)
                      </Typography>
                      <Chip
                        size="small"
                        color={activeGame.numbers.length === activeGame.targetCount ? 'success' : 'warning'}
                        label={`${activeGame.numbers.length}/${activeGame.targetCount} marcadas`}
                        sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700 }}
                      />
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Selecione um jogo na fila abaixo para marcar as dezenas no volante.
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    onClick={() => setInputMode((prev) => (prev === 'wheel' ? 'text' : 'wheel'))}
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                  >
                    {inputMode === 'wheel' ? 'Digitação em lote' : 'Usar volante'}
                  </Button>

                  {activeGame && inputMode === 'wheel' && (
                    <>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CasinoIcon fontSize="small" />}
                        onClick={generateSurpresinhaForActive}
                        sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                      >
                        Surpresinha neste jogo
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="inherit"
                        startIcon={<RestartAltIcon fontSize="small" />}
                        onClick={clearActiveGame}
                        disabled={!activeGame.numbers.length}
                        sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                      >
                        Limpar
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              {inputMode === 'wheel' ? (
                <NumberGrid sx={{ maxHeight: 200, p: 1, gap: 0.5 }}>
                  {availableNumbers.map((num) => {
                    const isSelected = activeGame?.numbers.includes(num)
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
                    placeholder="Cole ou digite jogos (ex: 04, 12, 23, 31, 45, 58 - um por linha)"
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
                    Adicionar à Fila
                  </Button>
                </Box>
              )}
            </Box>

            {/* FILA DE JOGOS: Mostra todos os jogos, o status de preenchimento e slots vazios */}
            <GamesSection sx={{ gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Fila de Preenchimento ({queuedGames.length} jogos)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {/* Adicionar Jogo Vazio Avulso */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Novo jogo:
                    </Typography>
                    {selectableTargetCounts.slice(0, 4).map((count) => (
                      <Chip
                        key={count}
                        label={`+ ${count} dezenas`}
                        size="small"
                        clickable
                        onClick={() => addEmptyGameToQueue(count)}
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 600 }}
                      />
                    ))}
                  </Box>

                  {pendingGamesCount > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<CasinoIcon fontSize="small" />}
                      onClick={fillAllPendingWithSurpresinha}
                      sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      Preencher Pendentes com Surpresinha
                    </Button>
                  )}

                  {queuedGames.length > 0 && (
                    <Button
                      size="small"
                      color="error"
                      variant="text"
                      onClick={clearAllQueuedGames}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0 }}
                    >
                      Limpar fila
                    </Button>
                  )}
                </Box>
              </Box>

              {queuedGames.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Nenhum jogo na fila. Clique no botão de sugestão acima ou adicione um jogo vazio para começar o preenchimento.
                  </Typography>
                </Box>
              ) : (
                <GamesListContainer sx={{ maxHeight: 320 }}>
                  {queuedGames.map((game, index) => {
                    const isActive = game.id === activeGameId
                    const isComplete = game.numbers.length === game.targetCount
                    const gamePrice = getGamePrice(lotteryType, game.targetCount)
                    const hits = getHitsCount(game.numbers)

                    // Cria slots vazios para completar o targetCount visualmente
                    const slots = Array.from({ length: game.targetCount }, (_, i) => {
                      const num = game.numbers[i]
                      return {
                        number: num,
                        filled: num !== undefined
                      }
                    })

                    return (
                      <QueueItemRow
                        key={game.id}
                        isActive={isActive}
                        isComplete={isComplete}
                        onClick={() => setActiveGameId(game.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 140 }}>
                          <Typography variant="caption" fontWeight={800} color={isActive ? 'primary.main' : 'text.secondary'}>
                            #{index + 1}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${game.targetCount} dezenas`}
                            variant="outlined"
                            sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 600 }}
                          />
                          <Chip
                            size="small"
                            color={isComplete ? 'success' : 'warning'}
                            label={isComplete ? 'Completo' : `${game.numbers.length}/${game.targetCount}`}
                            sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700 }}
                          />
                        </Box>

                        {/* Slots do Jogo (Números marcados + espaços pontilhados vazios) */}
                        <NumbersContainer sx={{ gap: 0.5 }}>
                          {slots.map((slot, sIdx) => {
                            const isMatched = slot.filled && sweepstake.result?.includes(slot.number)
                            return (
                              <SlotBall
                                key={sIdx}
                                filled={slot.filled}
                                matched={isMatched}
                              >
                                {slot.filled ? (slot.number < 10 ? `0${slot.number}` : slot.number) : '—'}
                              </SlotBall>
                            )
                          })}
                        </NumbersContainer>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
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
                          <Tooltip title="Surpresinha neste jogo">
                            <IconButton size="small" onClick={() => generateSurpresinhaForGame(game.id)} color="primary" sx={{ p: 0.25 }}>
                              <CasinoIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Limpar dezenas deste jogo">
                            <IconButton size="small" onClick={() => clearGameById(game.id)} disabled={!game.numbers.length} sx={{ p: 0.25 }}>
                              <RestartAltIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remover da fila">
                            <IconButton size="small" onClick={() => removeGameFromQueue(game.id)} color="error" sx={{ p: 0.25 }}>
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </QueueItemRow>
                    )
                  })}
                </GamesListContainer>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveGames}
                  disabled={isSavingGames || !queuedGames.length}
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