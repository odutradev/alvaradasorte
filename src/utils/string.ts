export const capitalizeWords = (text: string): string =>
  text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency'
  }).format(value)

export const normalizeString = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const computeJaro = (a: string, b: string): number => {
  if (a === b) return 1
  const lenA = a.length
  const lenB = b.length
  if (lenA === 0 || lenB === 0) return 0
  const matchRange = Math.max(Math.floor(Math.max(lenA, lenB) / 2) - 1, 0)
  const aMatches = new Array<boolean>(lenA).fill(false)
  const bMatches = new Array<boolean>(lenB).fill(false)
  let matches = 0
  for (let i = 0; i < lenA; i++) {
    const start = Math.max(0, i - matchRange)
    const end = Math.min(i + matchRange + 1, lenB)
    for (let j = start; j < end; j++) {
      if (bMatches[j] || a[i] !== b[j]) continue
      aMatches[i] = true
      bMatches[j] = true
      matches++
      break
    }
  }
  if (matches === 0) return 0
  let transpositions = 0
  let k = 0
  for (let i = 0; i < lenA; i++) {
    if (!aMatches[i]) continue
    while (!bMatches[k]) k++
    if (a[i] !== b[k]) transpositions++
    k++
  }
  return (matches / lenA + matches / lenB + (matches - transpositions / 2) / matches) / 3
}

export const jaroWinklerSimilarity = (a: string, b: string): number => {
  const jaroScore = computeJaro(a, b)
  let prefix = 0
  const limit = Math.min(4, a.length, b.length)
  for (let i = 0; i < limit; i++) {
    if (a[i] !== b[i]) break
    prefix++
  }
  return jaroScore + prefix * 0.1 * (1 - jaroScore)
}