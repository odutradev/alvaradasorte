import { DialogContent, DialogActions, DialogTitle, Typography, Button, Dialog, Link } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'

import { ListContainer, ProgressWrapper, SectionTitle, ParticipationCard } from './styles'
import { getSweepstakeDetails } from '@services/sweepstakes'
import { QuotaProgress } from '@components/quotaProgress'
import useAction from '@hooks/useAction'

import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { SweepstakeDetailsModalProps } from './types'

export const SweepstakeDetailsModal = ({ sweepstakeId, onClose, open }: SweepstakeDetailsModalProps) => {
  const [details, setDetails] = useState<SweepstakeDetailsResponse | null>(null)

  const fetchDetails = useCallback(async () => {
    await useAction({
      action: async () => await getSweepstakeDetails(sweepstakeId),
      callback: (res) => setDetails(res),
      silent: true
    })
  }, [sweepstakeId])

  useEffect(() => {
    if (open) fetchDetails()
  }, [open, fetchDetails])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Detalhes do Bolão</DialogTitle>
      <DialogContent>
        {!details ? (
          <Typography>Carregando...</Typography>
        ) : (
          <>
            <Typography variant="h6">{details.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Preço da Cota: R$ {details.quotaPrice.toFixed(2)}
            </Typography>
            <ProgressWrapper>
              <QuotaProgress
                availableQuotas={details.availableQuotas}
                filledQuotas={details.metadata.filledQuotas}
              />
            </ProgressWrapper>
            <SectionTitle variant="subtitle1">
              Participações ({details.participations.length})
            </SectionTitle>
            <ListContainer>
              {details.participations.map((part) => (
                <ParticipationCard key={part.id} variant="outlined">
                  <Typography variant="body2">
                    <strong>{part.userName}</strong><br />
                    Data: {dayjs(part.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                  <Link href={part.receiptUrl} target="_blank" rel="noreferrer">
                    Ver Comprovante
                  </Link>
                </ParticipationCard>
              ))}
              {details.participations.length === 0 && (
                <Typography variant="body2" color="text.secondary">Nenhum participante ainda.</Typography>
              )}
            </ListContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}