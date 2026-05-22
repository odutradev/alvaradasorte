import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import Typography from '@mui/material/Typography'

import { PageWrapper, ContentContainer, GridContainer } from './styles'
import { ParticipantsTable } from './components/participantsTable'
import { getSweepstakeDetails } from '@services/sweepstakes'
import { DetailsCard } from './components/detailsCard'
import GridBackground from '@components/gridBackground'
import { getPresets } from '@services/presets'
import Subheader from '@components/subheader'
import useAction from '@hooks/useAction'
import Header from '@components/header'

import type { SweepstakeDetailsResponse } from '@services/sweepstakes/types'
import type { PresetResponse } from '@services/presets/types'

export const SweepstakeDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [details, setDetails] = useState<SweepstakeDetailsResponse | null>(null)
  const [preset, setPreset] = useState<PresetResponse | null>(null)

  const fetchDetails = useCallback(async () => {
    if (!id) return
    await useAction({
      action: async () => {
        const [detailsRes, presetsRes] = await Promise.all([
          getSweepstakeDetails(id),
          getPresets()
        ])
        return { detailsRes, presetsRes }
      },
      callback: ({ detailsRes, presetsRes }) => {
        setDetails(detailsRes)
        const found = presetsRes.find((p: PresetResponse) => p.id === detailsRes.presetId)
        if (found) setPreset(found)
      },
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
              <DetailsCard data={details} preset={preset} onUpdate={fetchDetails} />
              <ParticipantsTable participations={details.participations} />
            </GridContainer>
          )}
        </ContentContainer>
      </PageWrapper>
    </GridBackground>
  )
}
