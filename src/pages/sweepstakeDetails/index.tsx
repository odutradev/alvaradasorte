import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import Typography from '@mui/material/Typography'

import { PageWrapper, ContentContainer, GridContainer } from './styles'
import { ParticipantsTable } from './components/participantsTable'
import { getSweepstakeDetails } from '@services/sweepstakes'
import GridBackground from '@components/gridBackground'
import { DetailsCard } from './components/detailsCard'
import Subheader from '@components/subheader'
import useAction from '@hooks/useAction'
import Header from '@components/header'

import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'

export const SweepstakeDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [details, setDetails] = useState<SweepstakeDetailsResponse | null>(null)

  const fetchDetails = useCallback(async () => {
    if (!id) return
    await useAction({
      action: async () => await getSweepstakeDetails(id),
      callback: (res) => setDetails(res),
      silent: true
    })
  }, [id])

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <Subheader
            title="Detalhes do Bolão"
            buttonLabel="Voltar"
            onButtonClick={() => navigate('/sweepstakes')}
          />
          {!details ? (
            <Typography variant="body1">Carregando...</Typography>
          ) : (
            <GridContainer>
              <DetailsCard data={details} />
              <ParticipantsTable participations={details.participations} />
            </GridContainer>
          )}
        </ContentContainer>
      </PageWrapper>
    </GridBackground>
  )
}