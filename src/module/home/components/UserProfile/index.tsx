import Typography from '@mui/material/Typography'

import * as S from './styles'

import type { UserProfileProps } from './types'

export const UserProfile = ({ user }: UserProfileProps) => {
  const initials = user.name?.substring(0, 2).toUpperCase() || 'UN'

  return (
    <S.ProfileCard elevation={3}>
      <S.StyledAvatar src={user.photoUrl}>
        {initials}
      </S.StyledAvatar>
      <Typography variant="h5" fontWeight={700}>
        {user.name}
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
            Método de Login
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {user.authProviderId}
          </Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">
            ID do Usuário
          </Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-all', ml: 2 }}>
            {user.id}
          </Typography>
        </S.InfoRow>
      </S.InfoContainer>
    </S.ProfileCard>
  )
}