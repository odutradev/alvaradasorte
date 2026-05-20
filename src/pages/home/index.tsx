import { useEffect, useState, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { CompleteProfileModal } from './components/completeProfileModal'
import { JoinSweepstakeModal } from './components/joinSweepstakeModal'
import { SweepstakeCard } from './components/sweepstakeCard'
import { getSweepstakes } from '../../services/sweepstakes'
import { UserProfile } from './components/userProfile'
import useAction from '../../hooks/useAction'
import { useAuth } from '../../hooks/useAuth'
import { Header } from './components/header'
import * as S from './styles'

import type { SweepstakeResponse } from '../../services/sweepstakes/types'

export const HomePage = () => {
  const [sweepstakes, setSweepstakes] = useState<SweepstakeResponse[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { logout, user } = useAuth()

  const fetchSweepstakes = useCallback(async () => {
    await useAction({
      action: async () => await getSweepstakes(),
      callback: (data) => setSweepstakes(data),
      silent: true
    })
  }, [])

  useEffect(() => {
    if (user) fetchSweepstakes()
  }, [user, fetchSweepstakes])

  if (!user) return <Navigate to="/login" replace />

  const isProfileIncomplete = !user.fullName || !user.department || !user.phone

  return (
    <S.PageWrapper>
      <Header onLogout={logout} userRole={user.role} />
      <S.ContentContainer>
        <S.GridContainer>
          <Box>
            <UserProfile user={user} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              Bolões Disponíveis
            </Typography>
            {sweepstakes.map((swp) => (
              <SweepstakeCard key={swp.id} data={swp} onJoin={setSelectedId} />
            ))}
            {sweepstakes.length === 0 && (
              <Typography variant="body1" color="text.secondary">
                Nenhum bolão aberto no momento.
              </Typography>
            )}
          </Box>
        </S.GridContainer>
      </S.ContentContainer>
      <CompleteProfileModal open={isProfileIncomplete} />
      <JoinSweepstakeModal open={!!selectedId} onClose={() => setSelectedId(null)} onSuccess={fetchSweepstakes} sweepstakeId={selectedId!} />
    </S.PageWrapper>
  )
}

export default HomePage