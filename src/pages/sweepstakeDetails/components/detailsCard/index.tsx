import Typography from '@mui/material/Typography'
import { useState } from 'react'
import dayjs from 'dayjs'

import { CardContainer, DividerLine, StyledTextButton } from './styles'
import { capitalizeWords, formatCurrency } from '@utils/string'
import { QuotaProgress } from '@components/quotaProgress'
import MessageModal from '../messageModal'
import GamesModal from '../gamesModal'
import InfoRow from '../infoRow'

import type { DetailsCardProps } from './types'

const DetailsCard = ({ data, preset, onUpdate }: DetailsCardProps) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false)

  const collectedValue = (data.participations?.length ?? 0) * data.quotaPrice

  return (
    <CardContainer elevation={2}>
      <Typography variant="h6" fontWeight={600} color="primary">
        {capitalizeWords(data.title)}
      </Typography>
      <StyledTextButton variant="text" size="small" onClick={() => setIsMessageModalOpen(true)}>
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
      <MessageModal
        open={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        data={data}
        preset={preset}
      />
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