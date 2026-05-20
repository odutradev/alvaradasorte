import { DialogContent, DialogActions, DialogTitle, Typography, Button, Dialog, Paper, Link } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'

import { getSweepstakeDetails } from '@core/services/sweepstakes'
import useAction from '@core/hooks/useAction'

import * as S from './styles'

import type { SweepstakeDetailsModalProps } from './types'
import type { SweepstakeDetailsResponse } from '@core/services/sweepstakes/types'

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
            <Typography variant="body2" color="text.secondary" paragraph>
              Cotas Disponíveis: {details.availableQuotas} | Preço: R$ {details.quotaPrice}
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
              Participações ({details.participations.length})
            </Typography>
            <S.ListContainer>
              {details.participations.map((part) => (
                <Paper key={part.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }} variant="outlined">
                  <Typography variant="body2">
                    <strong>{part.userName}</strong><br />
                    Data: {dayjs(part.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                  <Link href={part.receiptUrl} target="_blank" rel="noreferrer">
                    Ver Comprovante
                  </Link>
                </Paper>
              ))}
              {details.participations.length === 0 && (
                <Typography variant="body2" color="text.secondary">Nenhum participante ainda.</Typography>
              )}
            </S.ListContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}