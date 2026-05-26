import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { useState } from 'react'
import dayjs from 'dayjs'

import { CardContainer, DividerLine, StyledDialogContent, StyledDialogActions, StyledTextField, StyledTextButton } from './styles'
import { capitalizeWords, formatCurrency } from '@utils/string'
import { QuotaProgress } from '@components/quotaProgress'
import { generateSweepstakeMessage } from './utils'
import GamesModal from '../gamesModal'
import InfoRow from '../infoRow'

import type { ChangeEvent } from 'react'
import type { DetailsCardProps } from './types'

const DetailsCard = ({ data, preset, onUpdate }: DetailsCardProps) => {
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
    } catch {
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
      <InfoRow label="Valor da Cota" value={formatCurrency(data.quotaPrice)} />
      <InfoRow label="Prêmio Total" value={formatCurrency(data.prizeValue)} />
      <InfoRow label="Valor Arrecadado" value={formatCurrency(collectedValue)} valueColor="success.main" />
      <DividerLine />
      <QuotaProgress
        availableQuotas={data.availableQuotas}
        filledQuotas={data.participations?.length ?? 0}
      />
      <DividerLine />
      <InfoRow
        label="Limite de Compra"
        value={dayjs(data.purchaseLimitDate).format('DD/MM/YYYY HH:mm')}
      />
      <InfoRow
        label="Data do Sorteio"
        value={dayjs(data.drawDate).format('DD/MM/YYYY HH:mm')}
      />
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
          <Button onClick={handleClose} color="inherit">
            Fechar
          </Button>
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

export default DetailsCard