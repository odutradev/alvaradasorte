import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import GoogleIcon from '@mui/icons-material/Google'
import LogoutIcon from '@mui/icons-material/Logout'
import AppleIcon from '@mui/icons-material/Apple'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from 'react-router-dom'

import {
  ProfileCard,
  StyledAvatar,
  InfoContainer,
  InfoRow,
  ValueText,
  ActionsContainer,
  LogsButton,
  EditProfileButton,
  LogoutButton,
  ProviderRow,
  IconWrapper,
  IncompleteAlert
} from './styles'
import { capitalizeWords } from '@utils/string'
import useAuth from '@hooks/useAuth'

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

const UserProfile = ({ onEditProfile, isProfileIncomplete, sweepstakes, user }: UserProfileProps) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const displayName = user.fullName ?? user.name
  const initials = displayName?.substring(0, 2).toUpperCase() ?? 'UN'
  const providerIcon = PROVIDER_ICON_MAP[user.authProviderId] ?? <EmailOutlinedIcon fontSize="small" />
  const providerLabel = PROVIDER_LABEL_MAP[user.authProviderId] ?? user.authProviderId
  const roleLabel = ROLE_LABEL_MAP[user.role]
  const roleIcon = ROLE_ICON_MAP[user.role]

  const totalUserQuotas = sweepstakes?.reduce((sum, s) => sum + (s.userParticipation?.quotaCount ?? 0), 0) ?? 0

  return (
    <ProfileCard elevation={0}>
      <StyledAvatar src={user.photoUrl}>
        {initials}
      </StyledAvatar>
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
          <Typography variant="body2" color="text.secondary">Minhas Cotas</Typography>
          <ValueText variant="body1" fontWeight={700} color="primary.main">
            {totalUserQuotas} {totalUserQuotas === 1 ? 'cota' : 'cotas'}
          </ValueText>
        </InfoRow>
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
      <ActionsContainer>
        <LogsButton
          variant="contained"
          color="primary"
          startIcon={<HistoryIcon />}
          onClick={() => navigate('/my-logs')}
        >
          Meus Logs de Ações
        </LogsButton>
        <EditProfileButton
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={onEditProfile}
        >
          Editar Perfil
        </EditProfileButton>
        <LogoutButton
          variant="text"
          startIcon={<LogoutIcon />}
          onClick={logout}
        >
          Sair
        </LogoutButton>
      </ActionsContainer>
    </ProfileCard>
  )
}

export default UserProfile
