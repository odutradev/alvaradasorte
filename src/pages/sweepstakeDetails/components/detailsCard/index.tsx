import EditIcon from '@mui/icons-material/Edit'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useState } from 'react'
import dayjs from 'dayjs'

import { CardContainer, DividerLine, StyledTextButton, HeaderRow, ActionButtonsGroup } from './styles'
import { capitalizeWords, formatCurrency } from '@utils/string'
import { QuotaProgress } from '@components/quotaProgress'
import MessageModal from '../messageModal'
import EditForm from './components/editForm'
import GamesModal from '../gamesModal'
import InfoRow from '../infoRow'

import type { DetailsCardProps } from './types'

const DetailsCard = ({ data, preset, presets, onUpdate }: DetailsCardProps) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const filledQuotasCount = data.participations?.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0) ?? 0
  const collectedValue = filledQuotasCount * data.quotaPrice

  return (
    <CardContainer elevation={2}>
      <HeaderRow>
        <Typography variant="h6" fontWeight={600} color="primary">
          {capitalizeWords(data.title)}
        </Typography>
        {!isEditing && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            Editar Dados
          </Button>
        )}
      </HeaderRow>

      {isEditing ? (
        <EditForm
          data={data}
          presets={presets}
          onSuccess={onUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {data.description && (
            <Typography variant="body2" color="text.secondary">
              {data.description}
            </Typography>
          )}

          <ActionButtonsGroup>
            <StyledTextButton variant="text" size="small" onClick={() => setIsMessageModalOpen(true)}>
              Ver Mensagem
            </StyledTextButton>
            <StyledTextButton variant="text" size="small" onClick={() => setIsGamesModalOpen(true)}>
              Configurar Jogos
            </StyledTextButton>
          </ActionButtonsGroup>

          <DividerLine />

          <InfoRow label="Valor da Cota" value={formatCurrency(data.quotaPrice)} />
          <InfoRow label="Prêmio Total" value={formatCurrency(data.prizeValue)} />
          <InfoRow label="Valor Arrecadado" value={formatCurrency(collectedValue)} valueColor="success.main" />

          <DividerLine />

          <QuotaProgress
            availableQuotas={data.availableQuotas}
            filledQuotas={filledQuotasCount}
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

          {preset && (
            <InfoRow
              label="Conta Recebedora"
              value={`${preset.receiverName} (${preset.bank})`}
            />
          )}
        </>
      )}

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