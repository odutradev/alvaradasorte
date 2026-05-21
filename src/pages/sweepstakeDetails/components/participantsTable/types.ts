import type { ParticipationResponse } from '@services/sweepstakes/types'

export interface ExtendedParticipation extends ParticipationResponse {
  userSector?: string
  sector?: string
}

export interface ParticipantsTableProps {
  participations: ExtendedParticipation[]
}