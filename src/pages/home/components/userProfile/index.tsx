import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PersonPinIcon from '@mui/icons-material/PersonPin';
import GoogleIcon from '@mui/icons-material/Google'
import AppleIcon from '@mui/icons-material/Apple'
import Typography from '@mui/material/Typography'
import { capitalizeWords } from '@utils/string';
import Tooltip from '@mui/material/Tooltip'

import { ProfileCard, StyledAvatar, InfoContainer, InfoRow, ValueText, ProviderRow, IconWrapper, IncompleteAlert } from './styles'

import type { UserProfileProps } from './types'
import type { JSX } from 'react'

const PROVIDER_ICON_MAP: Record<string, JSX.Element> = {
  'google.com': <GoogleIcon fontSize="small" />,
  'apple.com': <AppleIcon fontSize="small" />,
  'password': <EmailOutlinedIcon fontSize="small" />
}


const PROVIDER_LABEL_MAP: Record<string, string> = {
  'google.com': 'Google',
  'apple.com': 'Apple',
  'password': 'E-mail e Senha'
}

const ROLE_ICON_MAP: Record<string, JSX.Element> = {
  'admin': <AdminPanelSettingsIcon fontSize="small" />,
  'normal': <PersonPinIcon fontSize="small" />
}

const ROLE_LABEL_MAP: Record<string, string> = {
  'admin': 'Administrador',
  'normal': 'Padrão'
}

export const UserProfile = ({ user, isProfileIncomplete }: UserProfileProps) => {
  const displayName = user.fullName ?? user.name
  const initials = displayName?.substring(0, 2).toUpperCase() ?? 'UN'
  const providerIcon = PROVIDER_ICON_MAP[user.authProviderId] ?? <EmailOutlinedIcon fontSize="small" />
  const providerLabel = PROVIDER_LABEL_MAP[user.authProviderId] ?? user.authProviderId
  const roleLabel = ROLE_LABEL_MAP[user.role]
  const roleIcon = ROLE_ICON_MAP[user.role]

  return (
    <ProfileCard elevation={3}>
      <StyledAvatar src={user.photoUrl}>
        {initials}
      </StyledAvatar>
      {displayName && (
        <Typography variant="subtitle1" fontWeight={600} align="center">
          {capitalizeWords(displayName)}
        </Typography>
      )}
      {isProfileIncomplete && (
        <IncompleteAlert severity="warning">
          Complete seu perfil para participar dos bolões.
        </IncompleteAlert>
      )}
      <InfoContainer>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">E-mail</Typography>
          <ValueText variant="body1" fontWeight={500}>{user.email.toLocaleLowerCase()}</ValueText>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Telefone</Typography>
          <ValueText variant="body1" fontWeight={500}>{user.phone ?? 'Não informado'}</ValueText>
        </InfoRow>
        <InfoRow>
          <Typography variant="body2" color="text.secondary">Setor</Typography>
          <ValueText variant="body1" fontWeight={500}>{capitalizeWords(user.department ?? 'Não informado')}</ValueText>
        </InfoRow>
      </InfoContainer>
      <ProviderRow>
        <Tooltip title={`Login via ${providerLabel}`}>
          <IconWrapper>
            {providerIcon}
          </IconWrapper>
        </Tooltip>
        <Tooltip title={`Usuário ${roleLabel}`}>
          <IconWrapper>
            {roleIcon}
          </IconWrapper>
        </Tooltip>
      </ProviderRow>
    </ProfileCard>
  )
}
