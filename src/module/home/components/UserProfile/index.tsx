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
      <Typography variant="h5" fontWeight={700} align="center">
        {displayName}
      </Typography>
      <S.InfoContainer>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">ID</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.id}</Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">Nome</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.name}</Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">Nome Completo</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.fullName ?? 'Não informado'}</Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">E-mail</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.email}</Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">Telefone</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.phone ?? 'Não informado'}</Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">Setor</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.department ?? 'Não informado'}</Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">Cargo</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.role}</Typography>
        </S.InfoRow>
        <S.InfoRow>
          <Typography variant="body2" color="text.secondary">Login via</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.authProviderId}</Typography>
        </S.InfoRow>
      </S.InfoContainer>
    </S.ProfileCard>
  )
}