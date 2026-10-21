import lotteriesRulesJson from '../data/lotteriesRules.json'

export interface LotteryRule {
  name: string
  totalNumbers: number
  minNumbers: number
  maxNumbers: number
  prices: Record<string, number>
}

export type LotteryRulesMap = Record<string, LotteryRule>

export const LOTTERIES_RULES = lotteriesRulesJson as LotteryRulesMap

export const normalizeLotteryKey = (type?: string): string => {
  if (!type) return 'megasena'
  return type.toLowerCase().replace(/[^a-z]/g, '')
}

export const getLotteryRule = (type?: string): LotteryRule => {
  const key = normalizeLotteryKey(type)
  return LOTTERIES_RULES[key] || LOTTERIES_RULES.megasena
}

export const getGamePrice = (type: string | undefined, numbersCount: number): number => {
  const rule = getLotteryRule(type)
  const price = rule.prices[String(numbersCount)]
  if (price !== undefined) return price
  // Fallback para o menor preço caso não encontre
  const minPrice = rule.prices[String(rule.minNumbers)]
  return minPrice || 0
}
