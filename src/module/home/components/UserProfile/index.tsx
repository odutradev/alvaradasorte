import Typography from '@mui/material/Typography'

import * as S from './styles'

import type { UserProfileProps } from './types'

export const UserProfile = ({ user }: UserProfileProps) => {
  const displayName = user.fullName ?? user.name
  const initials = displayName?.substring(0, 2).toUpperCase() || 'UN'

  return (
    <S.ProfileCard elevation={3}>
      <S.StyledAvatar src={user.photoUrl}>
        {initials}
      </S.StyledAvatar>
      <Typography variant="h5" fontWeight={700}>
        {displayName}
      </Typography>
      <S.InfoContainer>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">
            E-mail
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {user.email}
          </Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">
            Telefone
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {user.phone ?? 'Não informado'}
          </Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">
            Setor
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {user.department ?? 'Não informado'}
          </Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">
            Método de Login
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {user.authProviderId}
          </Typography>
        </S.InfoRow>
      </S.InfoContainer>
    </S.ProfileCard>
  )
}