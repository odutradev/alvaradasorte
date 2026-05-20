import Typography from '@mui/material/Typography'

import { ProfileCard, StyledAvatar, InfoContainer, InfoRow } from './styles'

import type { UserProfileProps } from './types'

export const UserProfile = ({ user }: UserProfileProps) => {
  const displayName = user.fullName ?? user.name
  const initials = displayName?.substring(0, 2).toUpperCase() || 'UN'

  return (
    <ProfileCard elevation={3}>
      <StyledAvatar src={user.photoUrl}>
        {initials}
      </StyledAvatar>
      <Typography variant="h5" fontWeight={700} align="center">
        {displayName}
      </Typography>
      <InfoContainer>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">ID</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.id}</Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Nome</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.name}</Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Nome Completo</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.fullName ?? 'Não informado'}</Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">E-mail</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.email}</Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Telefone</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.phone ?? 'Não informado'}</Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Setor</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.department ?? 'Não informado'}</Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Cargo</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.role}</Typography>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Login via</Typography>
          <Typography variant="body1" fontWeight={500} sx={{ wordBreak: 'break-word', textAlign: 'right' }}>{user.authProviderId}</Typography>
        </InfoRow>
      </InfoContainer>
    </ProfileCard>
  )
}