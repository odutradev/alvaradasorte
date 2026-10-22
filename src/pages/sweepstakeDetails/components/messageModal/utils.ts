import dayjs from 'dayjs'

import { capitalizeWords, formatCurrency } from '@utils/string'

import type { SweepstakeResponse } from '@services/sweepstakes/types'
import type { PresetResponse } from '@services/presets/types'

export type MessageType = 'invite' | 'games' | 'result'

/**
 * 1. Mensagem chamando pro bolão (Convite)
 */
export const generateInviteMessage = (data: SweepstakeResponse, preset: PresetResponse | null): string => {
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

  parts.push(`🍀 *${capitalizeWords(data.title)}* 🍀`)
  if (data.contestNumber) parts.push(`*Concurso #${data.contestNumber}*`)
  if (data.description) parts.push(data.description)
  parts.push('')
  parts.push(`🏆 *Prêmio Estimado:* ${prizeValueFormatted}`)
  parts.push(`💵 *Valor da Cota:* ${quotaPriceFormatted}`)
  parts.push(`📅 *Data do Sorteio:* ${drawDateFormatted}`)
  parts.push(`⏱️ *Limite para PIX:* até às ${limitTime} do dia ${limitDay}`)
  parts.push('')

  if (pixKey) {
    parts.push(`📲 *DADOS PARA PAGAMENTO (PIX):*`)
    parts.push(`Chave PIX: ${pixKey}`)
    if (receiverName) parts.push(`Nome: ${capitalizeWords(receiverName)}`)
    if (bankName) parts.push(`Banco: ${capitalizeWords(bankName)}`)
    parts.push('')
  }

  parts.push(`💻 *COMO CONFIRMAR SUA PARTICIPAÇÃO:*`)
  parts.push(`1. Acesse: https://alvaradasorte.odutra.com/`)
  parts.push(`2. Entre com seu E-mail ou Conta Google.`)
  parts.push(`3. Preencha seu perfil (Nome completo, Telefone e Setor).`)
  parts.push(`4. Clique em "Participar" no bolão ativo e anexe o comprovante do PIX!`)
  parts.push('')
  parts.push(`⚠️ *Importante:* O titular da conta deve ser o mesmo do perfil, e o comprovante enviado pelo sistema até o horário limite.`)

  return parts.join('\n')
}

/**
 * 2. Mensagem com os jogos realizados
 */
export const generateGamesMessage = (data: SweepstakeResponse): string => {
  const parts: string[] = []
  const drawDateFormatted = dayjs(data.drawDate).format('DD/MM/YYYY [às] HH:mm')
  const contestInfo = data.contestNumber ? ` • Concurso #${data.contestNumber}` : ''

  parts.push(`🍀 *JOGOS OFICIAIS DO BOLÃO* 🍀`)
  parts.push(`*${capitalizeWords(data.title)}*${contestInfo}`)
  parts.push(`📅 *Sorteio:* ${drawDateFormatted}`)
  parts.push(`🏆 *Prêmio Estimado:* ${formatCurrency(data.prizeValue)}`)
  parts.push('')

  if (!data.games || data.games.length === 0) {
    parts.push(`⚠️ *Nenhum jogo registrado ainda.*`)
    parts.push(`Os jogos serão cadastrados em breve pelo administrador.`)
    return parts.join('\n')
  }

  parts.push(`📋 *JOGOS REGISTRADOS (${data.games.length} JOGOS):*`)
  parts.push('')

  data.games.forEach((game, index) => {
    const formattedNumbers = game.map((n) => (n < 10 ? `0${n}` : String(n))).join(' - ')
    parts.push(`🎯 *Jogo ${index + 1} (${game.length} dezenas):*`)
    parts.push(`${formattedNumbers}`)
    parts.push('')
  })

  parts.push(`🤞 *Boa sorte a todos os participantes!*`)
  return parts.join('\n')
}

/**
 * 3. Mensagem com os jogos realizados, o resultado e acertos destacados nos jogos realizados
 */
export const generateResultConferenceMessage = (data: SweepstakeResponse): string => {
  const parts: string[] = []
  const contestInfo = data.contestNumber ? ` • Concurso #${data.contestNumber}` : ''
  const drawDateFormatted = dayjs(data.drawDate).format('DD/MM/YYYY')

  parts.push(`📊 *RESULTADO E CONFERÊNCIA DO BOLÃO* 📊`)
  parts.push(`*${capitalizeWords(data.title)}*${contestInfo}`)
  parts.push(`📅 *Data:* ${drawDateFormatted}`)
  parts.push('')

  const resultNumbers = data.result ?? []
  if (resultNumbers.length === 0) {
    parts.push(`⏳ *Resultado oficial ainda não divulgado pela Caixa Econômica.*`)
    parts.push(`Assim que o sorteio for realizado, a conferência com os acertos será publicada aqui.`)
    return parts.join('\n')
  }

  const resultFormatted = resultNumbers.map((n) => (n < 10 ? `0${n}` : String(n))).join(' - ')
  parts.push(`🔮 *DEZENAS SORTEADAS:*`)
  parts.push(`👉 *${resultFormatted}*`)
  parts.push('')
  parts.push('────────────────────────────')
  parts.push(`📋 *CONFERÊNCIA DOS JOGOS:*`)
  parts.push('')

  if (!data.games || data.games.length === 0) {
    parts.push(`⚠️ Nenhum jogo foi registrado para conferência.`)
    return parts.join('\n')
  }

  let maxHits = 0
  let bestGames: number[] = []

  data.games.forEach((game, index) => {
    const hits = game.filter((n) => resultNumbers.includes(n)).length
    if (hits > maxHits) {
      maxHits = hits
      bestGames = [index + 1]
    } else if (hits === maxHits && hits > 0) {
      bestGames.push(index + 1)
    }

    const hitLabel = hits === 1 ? '1 acerto' : `${hits} acertos`
    const hitBadge = hits >= 4 ? `🔥 *${hitLabel.toUpperCase()}!*` : `(${hitLabel})`

    // Destaque nas dezenas: acertadas com ✅ e negrito
    const numbersWithHits = game
      .map((n) => {
        const str = n < 10 ? `0${n}` : String(n)
        return resultNumbers.includes(n) ? `✅ *${str}*` : str
      })
      .join('  ')

    parts.push(`🎯 *Jogo ${index + 1}* ${hitBadge}:`)
    parts.push(`${numbersWithHits}`)
    parts.push('')
  })

  parts.push('────────────────────────────')
  if (maxHits > 0) {
    parts.push(`🏆 *Melhor desempenho:* ${maxHits} acertos (Jogo ${bestGames.join(', ')})`)
  } else {
    parts.push(`Nenhum acerto registrado nos jogos desta rodada.`)
  }
  parts.push(`🍀 *Obrigado a todos os participantes do bolão!*`)

  return parts.join('\n')
}

// Mantém retrocompatibilidade para qualquer import antigo
export const generateSweepstakeMessage = generateInviteMessage