import { useState } from 'react'
import { alpha } from '@mui/material/styles'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CasinoIcon from '@mui/icons-material/Casino'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'

import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import {
  ModalContainer,
  BudgetSummaryGrid,
  BudgetCard,
  SuggestionCard,
  NumberGrid,
  NumberBall,
  GamesSection,
  GamesListContainer,
  GameRow,
  NumbersContainer,
  NumberChip,
  SectionDivider,
  ResultSection
} from './styles'
import { LOTTERY_METADATA, getLotteryMeta } from '@services/lotteries'
import { getLotteryRule, getGamePrice } from '@utils/lotteryRules'
import { formatCurrency } from '@utils/string'
import Modal from '@components/modal'
import useGamesModal from './hook'

import type { GamesModalProps } from './types'

const GamesModal = ({ sweepstake, onUpdate, open, onClose }: GamesModalProps) => {
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
    isSavingGames,
    isSavingResult,
    setNewGameInput,
    setResultInput,
    setTargetCount,
    setLotteryType,
    toggleNumber,
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

  const [inputTab, setInputTab] = useState<'wheel' | 'manual'>('wheel')
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
      maxWidth="md"
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={700}>
            Configurar Jogos e Resultado
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
        </Box>
      }
      actions={
        <Button onClick={onClose} color="inherit">
          Fechar
        </Button>
      }
    >
      <ModalContainer>
        {/* Modalidade e Resumo Financeiro */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Controle Orçamentário do Bolão
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="lottery-type-label">Tipo de Jogo</InputLabel>
              <Select
                labelId="lottery-type-label"
                value={lotteryType}
                label="Tipo de Jogo"
                onChange={(e) => setLotteryType(e.target.value)}
              >
                {Object.keys(LOTTERY_METADATA).map((key) => (
                  <MenuItem key={key} value={key}>
                    {LOTTERY_METADATA[key].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <BudgetSummaryGrid>
            <BudgetCard tone="default">
              <Typography variant="caption" color="text.secondary">
                Valor Arrecadado (Disponível)
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(availableBudget)}
              </Typography>
            </BudgetCard>

            <BudgetCard tone={balance < 0 ? 'error' : 'default'}>
              <Typography variant="caption" color="text.secondary">
                Total dos Jogos Cadastrados ({games.length})
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatCurrency(totalCurrentCost)}
              </Typography>
            </BudgetCard>

            <BudgetCard tone={balance >= 0 ? 'success' : 'error'}>
              <Typography variant="caption" color="text.secondary">
                Saldo Restante
              </Typography>
              <Typography variant="h6" fontWeight={700} color={balance >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(balance)}
              </Typography>
            </BudgetCard>
          </BudgetSummaryGrid>
        </Box>

        {/* Card de Sugestão / Indicação Inteligente por Orçamento */}
        {allocationSuggestion.allocations.length > 0 && (
          <SuggestionCard elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700} color="primary">
                  Indicação de Jogos pelo Valor Disponível
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<CasinoIcon fontSize="small" />}
                onClick={applySuggestion}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Gerar Sugestão ({allocationSuggestion.totalGamesCount} {allocationSuggestion.totalGamesCount === 1 ? 'jogo' : 'jogos'})
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Priorizando jogos maiores e mais caros para maximizar as probabilidades com o valor disponível:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {allocationSuggestion.allocations.map((item, idx) => (
                <Chip
                  key={idx}
                  size="small"
                  variant="outlined"
                  color="primary"
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

        {/* Área de Criação de Jogos */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={inputTab}
              onChange={(_, val) => setInputTab(val)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="wheel" label="Volante Interativo" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab value="manual" label="Digitar ou Colar em Lote" sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Box>

          {inputTab === 'wheel' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Seletor de Dezenas */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                  Quantidade de dezenas:
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
                      sx={{
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: isSelected ? 'primary.main' : 'transparent',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderWidth: isSelected ? 1.5 : 1,
                        borderStyle: 'solid',
                        color: isSelected ? '#ffffff' : 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: isSelected ? 'primary.dark' : (theme) => alpha(theme.palette.primary.main, 0.15),
                          transform: 'translateY(-1px)'
                        }
                      }}
                    />
                  )
                })}
              </Box>

              {/* Status e Ações do Volante */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {selectedNumbers.length} de {targetCount} dezenas marcadas{' '}
                  <Typography component="span" variant="caption" color="text.secondary">
                    (Valor do bilhete: {formatCurrency(currentWheelPrice)})
                  </Typography>
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CasinoIcon fontSize="small" />}
                    onClick={generateSurpresinha}
                    sx={{ textTransform: 'none' }}
                  >
                    Surpresinha
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    startIcon={<RestartAltIcon fontSize="small" />}
                    onClick={clearSelectedNumbers}
                    disabled={!selectedNumbers.length}
                    sx={{ textTransform: 'none' }}
                  >
                    Limpar
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon fontSize="small" />}
                    onClick={addCurrentGame}
                    disabled={!isCurrentGameComplete}
                    sx={{ textTransform: 'none' }}
                  >
                    Adicionar Jogo
                  </Button>
                </Box>
              </Box>

              {/* Grade Interativa do Volante */}
              <NumberGrid>
                {availableNumbers.map((num) => {
                  const isSelected = selectedNumbers.includes(num)
                  return (
                    <NumberBall
                      key={num}
                      selected={isSelected}
                      badgeColor={lotteryColor}
                      onClick={() => toggleNumber(num)}
                    >
                      {num < 10 ? `0${num}` : num}
                    </NumberBall>
                  )
                })}
              </NumberGrid>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                multiline
                rows={3}
                size="small"
                fullWidth
                label="Digite os números ou cole vários jogos (um por linha)"
                placeholder="Exemplo:\n01, 05, 12, 23, 34, 45\n02, 08, 14, 25, 33, 49"
                value={newGameInput}
                onChange={(e) => setNewGameInput(e.target.value)}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon fontSize="small" />}
                onClick={addGameFromInput}
                disabled={!newGameInput.trim()}
                sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
              >
                Adicionar da Digitação
              </Button>
            </Box>
          )}
        </Box>

        <SectionDivider />

        {/* Lista de Jogos Cadastrados */}
        <GamesSection>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Jogos Cadastrados ({games.length})
            </Typography>
            {games.length > 0 && (
              <Button
                size="small"
                color="error"
                variant="text"
                onClick={clearAllGames}
                sx={{ textTransform: 'none' }}
              >
                Remover Todos
              </Button>
            )}
          </Box>

          {games.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhum jogo cadastrado. Utilize o volante, a indicação automática ou a digitação para incluir jogos.
            </Typography>
          ) : (
            <GamesListContainer>
              {games.map((game, index) => {
                const gamePrice = getGamePrice(lotteryType, game.length)
                const hits = getHitsCount(game)
                return (
                  <GameRow key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 125 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">
                        #{index + 1}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${game.length} dezenas`}
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          height: 22,
                          borderColor: 'divider',
                          color: 'text.primary'
                        }}
                      />
                      <Typography variant="caption" fontWeight={700} color="text.primary">
                        {formatCurrency(gamePrice)}
                      </Typography>
                    </Box>

                    <NumbersContainer>
                      {getMatchedNumbers(game).map((entry, i) => (
                        <NumberChip key={i} matched={entry.matched}>
                          {entry.number < 10 ? `0${entry.number}` : entry.number}
                        </NumberChip>
                      ))}
                    </NumbersContainer>

                    {hits > 0 && (
                      <Chip
                        size="small"
                        color="success"
                        label={`${hits} ${hits === 1 ? 'acerto' : 'acertos'}`}
                        icon={<CheckIcon fontSize="small" />}
                        sx={{ fontWeight: 700, fontSize: '0.75rem', height: 24 }}
                      />
                    )}

                    <Tooltip title="Excluir Jogo">
                      <IconButton size="small" onClick={() => removeGame(index)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </GameRow>
                )
              })}
            </GamesListContainer>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveGames}
            disabled={isSavingGames || !games.length}
            sx={{ alignSelf: 'flex-start', textTransform: 'none', px: 3, borderRadius: 2 }}
          >
            {isSavingGames ? 'Salvando...' : 'Salvar Jogos'}
          </Button>
        </GamesSection>

        <SectionDivider />

        {/* Resultado do Sorteio */}
        <ResultSection>
          <Typography variant="subtitle1" fontWeight={700}>
            Resultado do Sorteio
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              size="small"
              fullWidth
              label="Dezenas sorteadas (separadas por vírgula ou espaço)"
              placeholder="Ex: 04, 12, 23, 31, 45, 58"
              value={resultInput}
              onChange={(e) => setResultInput(e.target.value)}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveResult}
              disabled={isSavingResult || !resultInput.trim()}
              sx={{ whiteSpace: 'nowrap', textTransform: 'none', height: 40, borderRadius: 2 }}
            >
              {isSavingResult ? 'Salvando...' : 'Salvar Resultado'}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Os números acertados em cada jogo do bolão são automaticamente destacados em verde na lista acima com a contagem de acertos.
          </Typography>
        </ResultSection>
      </ModalContainer>
    </Modal>
  )
}

export default GamesModal