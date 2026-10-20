import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import {
  CardContainer,
  CardContent,
  HeaderRow,
  NavigationControls,
  InfoRow,
  DescriptionText,
  DividerLine,
  ActionButton
} from './styles'
import { QuotaProgress } from '@components/quotaProgress'
import { formatCurrency } from '@utils/string'

import type { SweepstakeCardProps } from './types'

const SweepstakeCard = ({
  onJoin,
  data,
  currentIndex = 0,
  totalCount = 1,
  onPrev,
  onNext
}: SweepstakeCardProps) => {
  const isAvailable = data.availableQuotas > data.metadata.filledQuotas && dayjs().isBefore(dayjs(data.purchaseLimitDate))
  const isParticipant = data.userParticipation?.isParticipant ?? false
  const userQuotaCount = data.userParticipation?.quotaCount ?? 0

  const filledQuotas = data.metadata.filledQuotas ?? 0
  const currentPrizePerPerson = filledQuotas > 0 ? data.prizeValue / filledQuotas : 0
  const minPrizePerPerson = data.availableQuotas > 0 ? data.prizeValue / data.availableQuotas : 0

  return (
    <CardContainer elevation={0}>
      <CardContent>
        <HeaderRow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {data.title}
            </Typography>
            {isParticipant && (
              <Chip
                label={userQuotaCount > 0 ? `${userQuotaCount} ${userQuotaCount === 1 ? 'cota' : 'cotas'}` : 'Inscrito'}
                color="success"
                size="small"
                sx={{ fontWeight: 600, borderRadius: 1 }}
              />
            )}
          </Box>
          {totalCount > 1 && (
            <NavigationControls>
              <Chip
                label={`${currentIndex + 1} de ${totalCount}`}
                size="small"
                color="default"
                sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem', borderRadius: 1 }}
              />
              <IconButton
                onClick={onPrev}
                disabled={currentIndex === 0}
                size="small"
                aria-label="Bolão anterior"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={onNext}
                disabled={currentIndex === totalCount - 1}
                size="small"
                aria-label="Próximo bolão"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </NavigationControls>
          )}
        </HeaderRow>

        {data.description && (
          <DescriptionText variant="body2" color="text.secondary">
            {data.description}
          </DescriptionText>
        )}

        <DividerLine />

        <InfoRow>
          <Typography variant="body2" color="text.secondary">Valor da Cota:</Typography>
          <Typography variant="body1" fontWeight={600}>
            {formatCurrency(data.quotaPrice)}
          </Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Prêmio Total:</Typography>
          <Typography variant="body1" fontWeight={600}>
            {formatCurrency(data.prizeValue)}
          </Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Prêmio Atual por Pessoa:</Typography>
          <Typography variant="body1" fontWeight={600}>
            {formatCurrency(currentPrizePerPerson)}
          </Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Prêmio Mínimo por Pessoa:</Typography>
          <Typography variant="body1" fontWeight={600}>
            {formatCurrency(minPrizePerPerson)}
          </Typography>
        </InfoRow>

        <DividerLine />

        <QuotaProgress
          availableQuotas={data.availableQuotas}
          filledQuotas={data.metadata.filledQuotas}
        />

        <DividerLine />

        <InfoRow>
          <Typography variant="body2" color="text.secondary">Limite de Compra:</Typography>
          <Typography variant="body1" fontWeight={600}>
            {dayjs(data.purchaseLimitDate).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </InfoRow>
      </CardContent>

      <ActionButton
        variant="contained"
        disabled={!isAvailable}
        onClick={() => onJoin(data.id)}
        fullWidth
        sx={{ mt: 2 }}
      >
        {isParticipant && isAvailable ? 'Comprar mais cotas' : isAvailable ? 'Participar' : 'Esgotado / Fechado'}
      </ActionButton>
    </CardContainer>
  )
}

export default SweepstakeCard

