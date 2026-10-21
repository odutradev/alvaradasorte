export interface CaixaLotteryRawResponse {
  tipoJogo: string
  numero: number
  numeroConcursoProximo: number
  numeroConcursoAnterior?: number
  dataApuracao?: string
  dataProximoConcurso?: string
  valorEstimadoProximoConcurso?: number
  valorAcumuladoProximoConcurso?: number
  acumulado?: boolean
  dezenasSorteadasOrdemSorteio?: string[]
  listaDezenas?: string[]
  localSorteio?: string
  nomeMunicipioUFSorteio?: string
}

export interface LotteryModalityInfo {
  type: string
  name: string
  color: string
  contestNumber: number
  nextContestNumber: number
  drawDate: string | null
  estimatedPrize: number
  accumulatedPrize: number
  isAccumulated: boolean
  lastDrawnNumbers?: string[]
}
