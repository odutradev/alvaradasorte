import Typography from '@mui/material/Typography'
import { useState, ChangeEvent } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import dayjs from 'dayjs'

import { CardContainer, InfoRow, DividerLine, ProgressContainer, ProgressHeader, ProgressBarTrack, ProgressBarFill, StyledDialogContent, StyledDialogActions, StyledTextField, StyledTextButton } from './styles'
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
        <Typography variant="body2" color="text.secondary">
          Cotas Preenchidas
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {filledQuotas}/{total}
        </Typography>
      </ProgressHeader>
      <ProgressBarTrack>
        <ProgressBarFill percentage={percentage} />
      </ProgressBarTrack>
    </ProgressContainer>
  )
}

export const DetailsCard = ({ data, preset }: DetailsCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [copied, setCopied] = useState(false)
  const collectedValue = (data.participations?.length ?? 0) * data.quotaPrice

  const handleOpen = () => {
    setMessageText(generateMessage())
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setCopied(false)
  }

  const generateMessage = () => {
    const limitDateObj = dayjs(data.purchaseLimitDate)
    const limitTime = limitDateObj.minute() === 0 ? limitDateObj.format('H[h]') : limitDateObj.format('H:mm')
    const limitDay = limitDateObj.format('DD/MM')
    const drawDateFormatted = dayjs(data.drawDate).format('DD/MM/YYYY HH:mm')
    const prizeValueFormatted = formatCurrency(data.prizeValue)
    const quotaPriceFormatted = formatCurrency(data.quotaPrice)
    const pixKey = preset?.pix || ''
    const receiverName = preset?.receiverName || ''
    const bankName = preset?.bank || ''

    const parts = []
    parts.push(`*${capitalizeWords(data.title)}*`)
    if (data.description) {
      parts.push(data.description)
    }
    parts.push('')
    parts.push(`🏆 *Prêmio:* ${prizeValueFormatted}`)
    parts.push(`💵 *Valor da Cota:* ${quotaPriceFormatted}`)
    parts.push(`📅 *Sorteio:* ${drawDateFormatted}`)
    parts.push(`⏱️ *Limite para PIX:* até às ${limitTime} do dia ${limitDay}`)
    parts.push('')

    if (pixKey) {
      parts.push(`📲 *DADOS PARA PIX:*`)
      parts.push(`Chave PIX: ${pixKey}`)
      if (receiverName) {
        parts.push(`Nome: ${capitalizeWords(receiverName)}`)
      }
      if (bankName) {
        parts.push(`Banco: ${capitalizeWords(bankName)}`)
      }
      parts.push('')
    }

    parts.push(`💻 *COMO CONFIRMAR SUA PARTICIPAÇÃO:*`)
    parts.push(`1. Acesse: https://alvaradasorte.odutra.com/`)
    parts.push(`2. Entre com seu E-mail ou Conta Google.`)
    parts.push(`3. Preencha seu perfil (Nome completo, Telefone e Setor).`)
    parts.push(`4. Clique em "Participar" no bolão ativo e envie o comprovante do PIX!`)
    parts.push('')
    parts.push(`⚠️ *Importante:* O titular da conta deve ser o mesmo cadastrado no perfil, e o comprovante enviado pelo sistema até o horário limite.`)

    return parts.join('\n')
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
      <DividerLine />
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Valor da Cota</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(data.quotaPrice)}
        </Typography>
      </InfoRow>
      <InfoRow>
        <Typography variant="body2" color="text.secondary">Prêmio Total</Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatCurrency(data.prizeValue)}
        </Typography>
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
      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        disableEnforceFocus
      >
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
          <Button
            onClick={handleCopyMessage}
            variant="contained"
            color={copied ? 'success' : 'primary'}
          >
            {copied ? 'Copiado!' : 'Copiar Mensagem'}
          </Button>
          <Button onClick={handleClose} color="inherit">
            Fechar
          </Button>
        </StyledDialogActions>
      </Dialog>
    </CardContainer>
  )
}