import { Navigate } from 'react-router-dom'

import { UserProfile } from './components/UserProfile'
import { useAuth } from '@core/hooks/useAuth'
import { Header } from './components/Header'
import * as S from './styles'

export const HomePage = () => {
  const { logout, user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  return (
    <S.PageWrapper>
      <Header onLogout={logout} />
      <S.ContentContainer>
        <UserProfile user={user} />
      </S.ContentContainer>
    </S.PageWrapper>
  )
}

export default HomePage