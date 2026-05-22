import Typography from '@mui/material/Typography'
import { useState, ChangeEvent } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import dayjs from 'dayjs'

import { CardContainer, InfoRow, DividerLine, ProgressContainer, ProgressHeader, ProgressBarTrack, ProgressBarFill, StyledDialogContent, StyledDialogActions, StyledTextField, StyledTextButton } from './styles'
import { GamesModal } from './subcomponents/gamesModal'
import { generateSweepstakeMessage } from './utils'
import { capitalizeWords, formatCurrency } from '@utils/string'

import type { DetailsCardProps } from './types'

interface QuotaProgressProps {
  availableQuotas: number
  filledQuotas: number
}

const QuotaProgress = ({ availableQuotas, filledQuotas }: QuotaProgressProps) => {
  const total = availableQuotas
  const percentage = total > 0 ? (filledQuotas / total) * 100 : 0
  return (
    <ProgressContainer>
      <ProgressHeader>
        <Typography variant="body2" color="text.secondary">Cotas Preenchidas</Typography>
        <Typography variant="body2" fontWeight={600}>{filledQuotas}/{total}</Typography>
      </ProgressHeader>
      <ProgressBarTrack>
        <ProgressBarFill percentage={percentage} />
      </ProgressBarTrack>
    </ProgressContainer>
  )
}

export const DetailsCard = ({ data, preset, onUpdate }: DetailsCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [copied, setCopied] = useState(false)
  const collectedValue = (data.participations?.length ?? 0) * data.quotaPrice

  const handleOpen = () => {
    setMessageText(generateSweepstakeMessage(data, preset))
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setCopied(false)
  }

  const handleCopyMessage = () => {
    const textarea = document.createElement('textarea')
    textarea.value = messageText
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, 99999)
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
    }
    document.body.removeChild(textarea)
  }

  return (
    <CardContainer elevation={2}>
      <Typography variant="h6" fontWeight={600} color="primary">
        {capitalizeWords(data.title)}
      </Typography>
      <StyledTextButton variant="text" size="small" onClick={handleOpen}>
        Ver Mensagem
      </StyledTextButton>
      <StyledTextButton variant="text" size="small" onClick={() => setIsGamesModalOpen(true)}>
        Configurar Jogos
      </StyledTextButton>
      <DividerLine />
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Valor da Cota</Typography>
        <Typography variant="body1" fontWeight={600}>{formatCurrency(data.quotaPrice)}</Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Total</Typography>
        <Typography variant="body1" fontWeight={600}>{formatCurrency(data.prizeValue)}</Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Valor Arrecadado</Typography>
        <Typography variant="body1" fontWeight={600} color="success.main">
          {formatCurrency(collectedValue)}
        </Typography>
      </InfoRow>
      <DividerLine />
      <QuotaProgress
        availableQuotas={data.availableQuotas}
        filledQuotas={data.participations?.length ?? 0}
      />
      <DividerLine />
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Limite de Compra</Typography>
        <Typography variant="body2" fontWeight={500}>
          {dayjs(data.purchaseLimitDate).format('DD/MM/YYYY HH:mm')}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Data do Sorteio</Typography>
        <Typography variant="body2" fontWeight={500}>
          {dayjs(data.drawDate).format('DD/MM/YYYY HH:mm')}
        </Typography>
      </InfoRow>
      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="md" disableEnforceFocus>
        <StyledDialogContent>
          <StyledTextField
            multiline
            fullWidth
            rows={12}
            variant="outlined"
            value={messageText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value)}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={handleCopyMessage} variant="contained" color={copied ? 'success' : 'primary'}>
            {copied ? 'Copiado!' : 'Copiar Mensagem'}
          </Button>
          <Button onClick={handleClose} color="inherit">Fechar</Button>
        </StyledDialogActions>
      </Dialog>
      <GamesModal
        sweepstake={data}
        onUpdate={onUpdate}
        open={isGamesModalOpen}
        onClose={() => setIsGamesModalOpen(false)}
      />
    </CardContainer>
  )
}
