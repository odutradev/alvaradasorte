import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

import { GamesSection, ResultSection, SectionDivider, GameRow, NumbersContainer, NumberChip, InputRow, SaveButton } from './styles'
import { useGamesModal } from './useGamesModal'

import type { GamesModalProps } from './types'

export const GamesModal = ({ sweepstake, onUpdate, open, onClose }: GamesModalProps) => {
  const {
    games,
    newGameInput,
    resultInput,
    setNewGameInput,
    setResultInput,
    addGame,
    removeGame,
    handleSaveGames,
    handleSaveResult,
    getMatchedNumbers
  } = useGamesModal(sweepstake.id, sweepstake.games ?? [], sweepstake.result ?? [], open, onUpdate)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Configurar Jogos e Resultado</DialogTitle>
      <DialogContent dividers>
        <GamesSection>
          <Typography variant="subtitle1" fontWeight={700}>Jogos do Bolão</Typography>
          {games.length === 0 && (
            <Typography variant="body2" color="text.secondary">Nenhum jogo cadastrado.</Typography>
          )}
          {games.map((game, index) => (
            <GameRow key={index}>
              <Typography variant="caption" color="text.secondary">#{index + 1}</Typography>
              <NumbersContainer>
                {getMatchedNumbers(game).map((entry, i) => (
                  <NumberChip key={i} matched={entry.matched}>{entry.number}</NumberChip>
                ))}
              </NumbersContainer>
              <IconButton size="small" onClick={() => removeGame(index)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </GameRow>
          ))}
          <InputRow>
            <TextField
              size="small"
              fullWidth
              label="Novo jogo (números separados por vírgula)"
              placeholder="Ex: 1, 2, 3, 4, 5, 6"
              value={newGameInput}
              onChange={(e) => setNewGameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addGame() }}
            />
            <Button variant="outlined" onClick={addGame} disabled={!newGameInput.trim()}>
              Adicionar
            </Button>
          </InputRow>
          <SaveButton variant="contained" onClick={handleSaveGames} disabled={!games.length}>
            Salvar Jogos
          </SaveButton>
        </GamesSection>
        <SectionDivider />
        <ResultSection>
          <Typography variant="subtitle1" fontWeight={700}>Resultado do Sorteio</Typography>
          <InputRow>
            <TextField
              size="small"
              fullWidth
              label="Números sorteados (separados por vírgula)"
              placeholder="Ex: 1, 2, 3, 4, 5, 6"
              value={resultInput}
              onChange={(e) => setResultInput(e.target.value)}
            />
            <SaveButton variant="contained" color="success" onClick={handleSaveResult} disabled={!resultInput.trim()}>
              Salvar Resultado
            </SaveButton>
          </InputRow>
          <Typography variant="caption" color="text.secondary">
            Os números acertados em cada jogo são destacados em verde acima.
          </Typography>
        </ResultSection>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}
