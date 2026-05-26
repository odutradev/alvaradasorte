import dayjs from 'dayjs'

import { capitalizeWords, formatCurrency } from '@utils/string'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { PresetResponse } from '@services/presets/types'

export const generateSweepstakeMessage = (data: SweepstakeResponse, preset: PresetResponse | null): string => {
  const limitDateObj = dayjs(data.purchaseLimitDate)
  const limitTime = limitDateObj.minute() === 0 ? limitDateObj.format('H[h]') : limitDateObj.format('H:mm')
  const limitDay = limitDateObj.format('DD/MM')
  const drawDateFormatted = dayjs(data.drawDate).format('DD/MM/YYYY HH:mm')
  const prizeValueFormatted = formatCurrency(data.prizeValue)
  const quotaPriceFormatted = formatCurrency(data.quotaPrice)
  const pixKey = preset?.pix ?? ''
  const receiverName = preset?.receiverName ?? ''
  const bankName = preset?.bank ?? ''

  const parts: string[] = []
  
  parts.push(`*${capitalizeWords(data.title)}*`)
  if (data.description) parts.push(data.description)
  parts.push('')
  parts.push(`🏆 *Prêmio:* ${prizeValueFormatted}`)
  parts.push(`💵 *Valor da Cota:* ${quotaPriceFormatted}`)
  parts.push(`📅 *Sorteio:* ${drawDateFormatted}`)
  parts.push(`⏱️ *Limite para PIX:* até às ${limitTime} do dia ${limitDay}`)
  parts.push('')

  if (pixKey) {
    parts.push(`📲 *DADOS PARA PIX:*`)
    parts.push(`Chave PIX: ${pixKey}`)
    if (receiverName) parts.push(`Nome: ${capitalizeWords(receiverName)}`)
    if (bankName) parts.push(`Banco: ${capitalizeWords(bankName)}`)
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