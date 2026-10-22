import { useState, useMemo } from 'react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
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

import { alpha } from '@mui/material/styles'
import {
  ModalContainer,
  SuggestionCard,
  SuggestedNumbersCard,
  SuggestedBallButton,
  NumberGrid,
  NumberBall,
  GamesSection,
  GamesListContainer,
  QueueItemRow,
  SlotBall,
  NumbersContainer,
  AddGameItemsContainer,
  NewGameButton,
  ResultSection,
  ResultCard
} from './styles'
import { getLotteryMeta } from '@services/lotteries'
import { getGamePrice, getLotteryOdds, getEquivalentGamesCount } from '@utils/lotteryRules'
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
    resultNumbers,
    suggestedNumbersList,
    totalSuggestedCount,
    usedSuggestedCount,
    pendingSuggestedCount,
    isSavingGames,
    isSavingResult,
    isFetchingCaixaResult,
    setActiveGameId,
    setNewGameInput,
    toggleNumber,
    toggleResultNumber,
    clearResultNumbers,
    handleFetchCaixaResult,
    generateSurpresinhaForActive,
    generateSurpresinhaForGame,
    fillAllPendingWithSurpresinha,
    fillGameWithSuggested,
    fillActiveGameWithSuggested,
    fillAllPendingWithSuggested,
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
  const suggestedNumbersSet = useMemo(
    () => new Set(suggestedNumbersList.map((s) => s.number)),
    [suggestedNumbersList]
  )

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

        {mainTab === 'games' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

            <SuggestedNumbersCard elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
                  <HowToVoteIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Números Indicados pelos Participantes
                  </Typography>
                  <Chip
                    size="small"
                    color="primary"
                    label={`${totalSuggestedCount} indicados`}
                    sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                  />
                  {totalSuggestedCount > 0 && (
                    <>
                      <Chip
                        size="small"
                        color="success"
                        variant="outlined"
                        icon={<CheckIcon sx={{ fontSize: '13px !important' }} />}
                        label={`${usedSuggestedCount} em jogos`}
                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                      />
                      <Chip
                        size="small"
                        color={pendingSuggestedCount > 0 ? 'warning' : 'default'}
                        variant="outlined"
                        label={`${pendingSuggestedCount} não usados`}
                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                      />
                    </>
                  )}
                </Box>

                {activeGame && totalSuggestedCount > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<HowToVoteIcon fontSize="small" />}
                    onClick={fillActiveGameWithSuggested}
                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, fontSize: '0.75rem' }}
                  >
                    Inserir indicados neste jogo
                  </Button>
                )}
              </Box>

              {totalSuggestedCount === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum participante indicou números na compra de cotas até o momento.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Clique em qualquer número para inseri-lo diretamente no jogo ativo selecionado:
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {suggestedNumbersList.map((item) => {
                      const isInActiveGame = activeGame?.numbers.includes(item.number)
                      return (
                        <Tooltip
                          key={item.number}
                          arrow
                          title={
                            <Box sx={{ p: 0.5, maxWidth: 220 }}>
                              <Typography variant="subtitle2" fontWeight={800} color="primary.light">
                                Dezena {item.number < 10 ? `0${item.number}` : item.number}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.25 }}>
                                {item.isUsed ? (
                                  <span style={{ color: '#4ade80', fontWeight: 700 }}>
                                    ✓ Já usada em {item.usedCount} jogo(s)
                                  </span>
                                ) : (
                                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                                    ● Ainda não usada em nenhum jogo
                                  </span>
                                )}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                Indicado por: {item.participants.join(', ')}
                              </Typography>
                              {activeGame && (
                                <Typography variant="caption" sx={{ color: '#38bdf8', display: 'block', mt: 0.25, fontWeight: 700 }}>
                                  {isInActiveGame ? 'Clique para remover do jogo ativo' : 'Clique para adicionar ao jogo ativo'}
                                </Typography>
                              )}
                            </Box>
                          }
                        >
                          <SuggestedBallButton
                            isUsed={item.isUsed}
                            badgeColor="#0284c7"
                            onClick={() => toggleNumber(item.number)}
                            sx={{
                              ...(isInActiveGame && {
                                outline: '2px solid #38bdf8',
                                outlineOffset: 2
                              })
                            }}
                          >
                            {item.number < 10 ? `0${item.number}` : item.number}
                            {item.isUsed && (
                              <CheckIcon
                                sx={{
                                  position: 'absolute',
                                  bottom: -2,
                                  right: -2,
                                  fontSize: 12,
                                  bgcolor: '#16a34a',
                                  color: '#fff',
                                  borderRadius: '50%',
                                  p: '1px'
                                }}
                              />
                            )}
                          </SuggestedBallButton>
                        </Tooltip>
                      )
                    })}
                  </Box>
                </Box>
              )}
            </SuggestedNumbersCard>

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
                      {suggestedNumbersList.length > 0 && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<HowToVoteIcon fontSize="small" />}
                          onClick={fillActiveGameWithSuggested}
                          sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          Preencher com indicados
                        </Button>
                      )}
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
                    const isSuggested = suggestedNumbersSet.has(num)
                    return (
                      <NumberBall
                        key={num}
                        selected={isSelected}
                        isSuggested={isSuggested}
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

            <GamesSection sx={{ gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Fila de Preenchimento
                  </Typography>
                  <Chip
                    size="small"
                    color={pendingGamesCount === 0 && queuedGames.length > 0 ? 'success' : 'default'}
                    label={`${queuedGames.length} jogos (${completedGamesCount} completos, ${pendingGamesCount} pendentes)`}
                    sx={{ height: 22, fontSize: '0.75rem', fontWeight: 700 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {pendingGamesCount > 0 && suggestedNumbersList.length > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<HowToVoteIcon fontSize="small" />}
                      onClick={fillAllPendingWithSuggested}
                      sx={{
                        bgcolor: '#0284c7',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
                        '&:hover': { bgcolor: '#0369a1' }
                      }}
                    >
                      Preencher Pendentes com Indicados ({pendingSuggestedCount} livres)
                    </Button>
                  )}

                  {pendingGamesCount > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CasinoIcon fontSize="small" />}
                      onClick={fillAllPendingWithSurpresinha}
                      sx={{
                        bgcolor: '#8b5cf6',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
                        '&:hover': { bgcolor: '#7c3aed' }
                      }}
                    >
                      Preencher Pendentes com Surpresinha
                    </Button>
                  )}

                  {queuedGames.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon fontSize="small" />}
                      onClick={clearAllQueuedGames}
                      sx={{
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                        color: '#f87171',
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }
                      }}
                    >
                      Limpar fila
                    </Button>
                  )}
                </Box>
              </Box>

              <AddGameItemsContainer>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    mr: 0.5
                  }}
                >
                  + Novo jogo:
                </Typography>

                {selectableTargetCounts.map((count) => {
                  const price = getGamePrice(lotteryType, count)
                  const odds = getLotteryOdds(lotteryType, count)
                  const equiv = getEquivalentGamesCount(lotteryType, count)
                  return (
                    <Tooltip
                      key={count}
                      arrow
                      title={
                        <Box sx={{ p: 0.5, maxWidth: 240 }}>
                          <Typography variant="subtitle2" fontWeight={800} display="block" color="primary.light">
                            Jogo com {count} dezenas
                          </Typography>
                          <Typography variant="body2" fontWeight={700} sx={{ mt: 0.25 }}>
                            Valor do bilhete: {formatCurrency(price)}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5, color: '#4ade80', fontWeight: 700 }}>
                            🎯 Chances de acertar: {odds}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                            Equivale a {equiv} aposta{equiv > 1 ? 's' : ''} simples
                          </Typography>
                        </Box>
                      }
                    >
                      <NewGameButton onClick={() => addEmptyGameToQueue(count)}>
                        <span>+ {count} dezenas</span>
                        <span style={{ color: '#4ade80', fontWeight: 700, marginLeft: 4 }}>
                          ({formatCurrency(price)})
                        </span>
                      </NewGameButton>
                    </Tooltip>
                  )
                })}
              </AddGameItemsContainer>

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
                <GamesListContainer sx={{ maxHeight: 260 }}>
                  {queuedGames.map((game, index) => {
                    const isActive = game.id === activeGameId
                    const isComplete = game.numbers.length === game.targetCount
                    const gamePrice = getGamePrice(lotteryType, game.targetCount)
                    const hits = getHitsCount(game.numbers)

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

                        <NumbersContainer sx={{ gap: 0.5 }}>
                          {slots.map((slot, sIdx) => {
                            const isMatched = slot.filled && sweepstake.result?.includes(slot.number)
                            const isSuggested = slot.filled && suggestedNumbersSet.has(slot.number)
                            return (
                              <SlotBall
                                key={sIdx}
                                filled={slot.filled}
                                matched={isMatched}
                                isSuggested={isSuggested}
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
                          {suggestedNumbersList.length > 0 && (
                            <Tooltip title="Preencher este jogo com números indicados">
                              <IconButton
                                size="small"
                                onClick={() => fillGameWithSuggested(game.id)}
                                color="info"
                                sx={{ p: 0.25 }}
                              >
                                <HowToVoteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          )}
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
                  disabled={isSavingGames}
                  sx={{ textTransform: 'none', px: 3, borderRadius: 2, fontWeight: 700 }}
                >
                  {isSavingGames ? 'Salvando...' : 'Salvar Jogos'}
                </Button>
              </Box>
            </GamesSection>
          </Box>
        )}

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